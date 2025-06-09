import { Client, getInboxIdForIdentifier } from "@xmtp/node-sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Global variables to store XMTP client and group
let xmtpClient = null;
let globalGroup = null;
let masterWallet = null;

// In-memory storage for member tracking (replace with database in production)
const memberCache = new Set();
const invitationQueue = new Map(); // userAddress -> timestamp

/**
 * Initialize the XMTP client with master wallet
 */
export async function initializeXMTPClient() {
  try {
    if (xmtpClient) {
      console.log("✅ XMTP client already initialized");
      return xmtpClient;
    }

    console.log("🔑 Initializing master wallet...");

    const privateKey = process.env.MASTER_WALLET_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("MASTER_WALLET_PRIVATE_KEY not found in environment variables");
    }

    // Create wallet from private key
    masterWallet = new ethers.Wallet(privateKey);
    console.log(`📍 Master wallet address: ${masterWallet.address}`);

    // Create XMTP-compatible signer
    const signer = {
      type: "EOA",
      getIdentifier: async () => {
        return {
          identifierKind: 0, // ETHEREUM enum value
          identifier: masterWallet.address.toLowerCase(),
        };
      },
      signMessage: async (message) => {
        try {
          let messageToSign;
          if (typeof message === "string") {
            messageToSign = message;
          } else if (message instanceof Uint8Array) {
            messageToSign = new TextDecoder().decode(message);
          } else {
            throw new Error("Unsupported message type");
          }

          const signature = await masterWallet.signMessage(messageToSign);

          // Convert hex signature to Uint8Array if needed
          if (typeof signature === "string") {
            return new Uint8Array(Buffer.from(signature.slice(2), "hex"));
          }
          return signature;
        } catch (error) {
          console.error("Error signing message:", error);
          throw error;
        }
      },
      getChainId: () => BigInt(1), // Ethereum mainnet
      getBlockNumber: () => undefined,
    };

    console.log("🌐 Creating XMTP client...");

    const xmtpEnv = process.env.XMTP_ENV || "production";

    // Generate a consistent database encryption key for XMTP V3
    // Use the master wallet private key to derive a consistent key
    const keyMaterial = masterWallet.privateKey + "xmtp-db-key";
    const hash = crypto.createHash("sha256").update(keyMaterial).digest();
    const dbEncryptionKey = new Uint8Array(hash);

    console.log(`🔐 Using database encryption key of length: ${dbEncryptionKey.length}`);

    xmtpClient = await Client.create(signer, {
      env: xmtpEnv,
      dbEncryptionKey: dbEncryptionKey,
    });

    console.log(`✅ XMTP client initialized successfully on ${xmtpEnv} network`);
    console.log(`📋 Client properties:`, Object.keys(xmtpClient));
    console.log(`📋 Client inboxId:`, xmtpClient.inboxId);
    console.log(`📋 Client address:`, xmtpClient.address);

    return xmtpClient;
  } catch (error) {
    console.error("❌ Failed to initialize XMTP client:", error);
    throw error;
  }
}

/**
 * Ensure the global group exists, create if it doesn't
 */
export async function ensureGlobalGroup() {
  try {
    if (!xmtpClient) {
      throw new Error("XMTP client not initialized");
    }

    const existingGroupId = process.env.GLOBAL_GROUP_ID;

    if (existingGroupId) {
      console.log(`🔍 Looking for existing group: ${existingGroupId}`);

      // Get all conversations and find the group
      const conversations = await xmtpClient.conversations.list();
      globalGroup = conversations.find((conv) => conv.id === existingGroupId);

      if (globalGroup) {
        console.log("🔍 Found existing global group:", {
          id: globalGroup.id,
          name: globalGroup.name,
          memberCount: "Loading...",
        });

        // Cache existing members using the async members() method
        try {
          await globalGroup.sync();
          const members = await globalGroup.members();
          members.forEach((member) => {
            memberCache.add(member.inboxId.toLowerCase());
          });
          console.log(`✅ Cached ${members.length} existing members`);
        } catch (error) {
          console.warn("⚠️ Failed to load existing members:", error.message);
        }

        return globalGroup;
      } else {
        console.log("❌ Existing group not found in master wallet conversations");
      }
    }

    // Create new group if none exists
    console.log("🌍 Creating new global group...");

    const groupName = process.env.GLOBAL_GROUP_NAME || "🌍 Public Square";
    const groupDescription = process.env.GLOBAL_GROUP_DESCRIPTION || "Global community chat";

    globalGroup = await xmtpClient.conversations.newGroup(
      [], // Start with no other members
      {
        name: groupName,
        description: groupDescription,
      }
    );

    console.log("✅ New global group created!");
    console.log(`📋 Group ID: ${globalGroup.id}`);
    console.log(`📝 Group Name: ${groupName}`);
    console.log("⚠️  IMPORTANT: Save this Group ID to your .env file as GLOBAL_GROUP_ID");

    // Send welcome message
    await globalGroup.send("🚀 Welcome to the Public Square! This is the global community chat where everyone can connect.");

    return globalGroup;
  } catch (error) {
    console.error("❌ Failed to ensure global group:", error);
    throw error;
  }
}

/**
 * Get global group information
 */
export async function getGlobalGroupInfo() {
  if (!globalGroup) {
    throw new Error("Global group not initialized");
  }

  console.log("🔍 Debug globalGroup object:", {
    globalGroupExists: !!globalGroup,
    globalGroupType: typeof globalGroup,
    globalGroupKeys: Object.keys(globalGroup),
    globalGroupId: globalGroup.id,
    globalGroupName: globalGroup.name,
    globalGroupDescription: globalGroup.description,
    masterWalletExists: !!masterWallet,
    masterWalletAddress: masterWallet?.address,
  });

  let memberCount = 0;
  try {
    const members = await globalGroup.members();
    memberCount = members.length;
  } catch (error) {
    console.warn("⚠️ Failed to get member count:", error.message);
  }

  const result = {
    groupId: globalGroup.id,
    masterAddress: masterWallet?.address,
    groupName: globalGroup.name || process.env.GLOBAL_GROUP_NAME,
    description: globalGroup.description || process.env.GLOBAL_GROUP_DESCRIPTION,
    memberCount: memberCount,
  };

  console.log("🔍 Debug getGlobalGroupInfo result:", result);

  return result;
}

/**
 * Check if a user can receive messages on XMTP (has an identity)
 */
export async function checkUserHasXMTPIdentity(address) {
  try {
    console.log("🔍 Checking XMTP identity for:", address);

    // Create identity object in the correct XMTP v3 format
    // identifierKind should be numeric: 0 = ETHEREUM
    const identity = {
      identifierKind: 0, // ETHEREUM enum value (numeric)
      identifier: address,
    };

    console.log("🔍 Using identity format:", JSON.stringify(identity, null, 2));

    // Check if this identity can receive messages
    const canMessageResults = await xmtpClient.canMessage([identity]);

    console.log("📊 canMessage results:", canMessageResults);

    // canMessage returns a Map with lowercase address as key, not the identity object
    const normalizedAddress = address.toLowerCase();
    const canMessage = canMessageResults.get(normalizedAddress) || false;

    console.log(`✅ User ${address} has XMTP identity:`, canMessage);

    // Return both the boolean result and the full results for potential inbox ID extraction
    return { hasIdentity: canMessage, results: canMessageResults };
  } catch (error) {
    console.error("❌ Error checking XMTP identity:", error);
    return { hasIdentity: false, results: null };
  }
}

/**
 * Add a user to the global group (send invitation) with retry logic
 */
export async function inviteUserToGlobalGroup(userAddress) {
  try {
    if (!globalGroup) {
      throw new Error("Global group not initialized");
    }

    // Normalize address
    const normalizedAddress = userAddress.toLowerCase();

    // Check if user is already a member
    if (memberCache.has(normalizedAddress)) {
      console.log(`👤 User ${userAddress} is already a member`);
      return { success: true, message: "User is already a member" };
    }

    // Check if invitation was recently sent (prevent spam)
    const lastInvitation = invitationQueue.get(normalizedAddress);
    const now = Date.now();
    const cooldownMs = 5 * 60 * 1000; // 5 minutes cooldown

    if (lastInvitation && now - lastInvitation < cooldownMs) {
      const remainingMs = cooldownMs - (now - lastInvitation);
      const remainingMinutes = Math.ceil(remainingMs / 60000);
      console.log(`⏳ Invitation cooldown active for ${userAddress} (${remainingMinutes}m remaining)`);
      return {
        success: false,
        message: `Please wait ${remainingMinutes} minutes before requesting another invitation`,
      };
    }

    console.log(`📤 Sending invitation to ${userAddress}...`);

    // Step 1: Check if user has XMTP identity with retry logic
    let identityCheckResult;
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 2000;

    while (retryCount < maxRetries) {
      try {
        identityCheckResult = await checkUserHasXMTPIdentity(userAddress);
        if (identityCheckResult.hasIdentity) {
          break;
        }

        // If no identity found, wait and retry (identity might be propagating)
        if (retryCount < maxRetries - 1) {
          console.log(`⏳ XMTP identity not found, waiting ${retryDelay}ms before retry ${retryCount + 1}/${maxRetries}...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }

        retryCount++;
      } catch (identityError) {
        console.error(`❌ Error checking identity (attempt ${retryCount + 1}):`, identityError);
        retryCount++;
        if (retryCount < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    // If no identity found after retries, return appropriate error
    if (!identityCheckResult || !identityCheckResult.hasIdentity) {
      console.log(`⚠️ User ${userAddress} doesn't have an XMTP identity after ${maxRetries} attempts`);
      return {
        success: false,
        message: "User must first create an XMTP client before joining groups. Please connect to XMTP first.",
        errorType: "NO_XMTP_IDENTITY",
        statusCode: 400,
      };
    }

    console.log(`✅ User has XMTP identity`);

    // Step 2: Get user's inbox ID from their address
    // In XMTP v3, group membership uses inbox IDs, not Ethereum addresses
    console.log(`🔄 Getting inbox ID for address: ${userAddress}`);

    let userInboxId;
    try {
      // Create identity object for the user
      const userIdentity = {
        identifierKind: 0, // ETHEREUM enum value
        identifier: normalizedAddress,
      };

      console.log("🔍 Using identity format:", JSON.stringify(userIdentity, null, 2));

      // Try different approaches to get inbox ID
      // Approach 1: Use the standalone getInboxIdForIdentifier function
      try {
        console.log("🔍 Using standalone getInboxIdForIdentifier function...");
        const xmtpEnv = process.env.XMTP_ENV || "production";
        userInboxId = await getInboxIdForIdentifier(userIdentity, xmtpEnv);
        console.log(`📋 Got inbox ID via standalone function: ${userInboxId}`);
      } catch (standaloneError) {
        console.log("⚠️ Standalone function failed, trying client method...");

        // Approach 2: Use client instance method
        if (typeof xmtpClient.getInboxIdByIdentifier === "function") {
          console.log("🔍 Using client.getInboxIdByIdentifier method...");
          userInboxId = await xmtpClient.getInboxIdByIdentifier(userIdentity);
          console.log(`📋 Got inbox ID via client method: ${userInboxId}`);
        } else {
          throw new Error("getInboxIdByIdentifier method not available on client");
        }
      }

      if (!userInboxId) {
        throw new Error("Inbox ID not found for user");
      }
    } catch (inboxError) {
      console.error(`❌ Failed to get inbox ID for ${userAddress}:`, inboxError);
      return {
        success: false,
        message: "Unable to determine user's inbox ID. Please try again later.",
        errorType: "INBOX_ID_ERROR",
        statusCode: 500,
      };
    }

    // Step 3: Add user to group using their inbox ID
    console.log(`🔄 Adding member with inbox ID: ${userInboxId}`);

    let addSuccess = false;
    retryCount = 0;

    while (retryCount < maxRetries && !addSuccess) {
      try {
        console.log(`🔄 Attempting to add member (attempt ${retryCount + 1}/${maxRetries})...`);

        // Use inbox ID for adding to group (XMTP v3 requirement)
        await globalGroup.addMembers([userInboxId]);
        addSuccess = true;
        console.log(`✅ Successfully added member with inbox ID: ${userInboxId}`);
      } catch (addError) {
        console.log(`❌ Add member attempt ${retryCount + 1} failed:`, addError.message);

        // Check if it's a "already a member" error
        if (addError.message.includes("already a member")) {
          memberCache.add(normalizedAddress);
          return { success: true, message: "User is already a member" };
        }

        retryCount++;
        if (retryCount < maxRetries) {
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    if (!addSuccess) {
      throw new Error(`Failed to add user to group after ${maxRetries} attempts`);
    }

    // Update caches
    memberCache.add(normalizedAddress);
    invitationQueue.set(normalizedAddress, now);

    return {
      success: true,
      message: "Invitation sent successfully",
      groupId: globalGroup.id,
    };
  } catch (error) {
    console.error(`❌ Failed to invite user ${userAddress}:`, error);

    // Handle specific XMTP errors
    if (error.message.includes("already a member")) {
      memberCache.add(userAddress.toLowerCase());
      return { success: true, message: "User is already a member" };
    }

    // Handle case where user doesn't have XMTP identity yet
    if (error.message.includes("SequenceId not found") || error.message.includes("invalid hexadecimal digit")) {
      console.log(`⚠️ User ${userAddress} doesn't have an XMTP identity yet`);
      return {
        success: false,
        message: "User must first create an XMTP client before joining groups. Please connect to XMTP first.",
        errorType: "NO_XMTP_IDENTITY",
        statusCode: 400,
      };
    }

    throw error;
  }
}

/**
 * Get group members (refresh from XMTP)
 */
export async function refreshGroupMembers() {
  try {
    if (!globalGroup) {
      throw new Error("Global group not initialized");
    }

    // Sync group data first
    await globalGroup.sync();

    // Get fresh member list
    const members = await globalGroup.members();

    // Update cache
    memberCache.clear();
    members.forEach((member) => {
      memberCache.add(member.inboxId.toLowerCase());
    });

    console.log(`🔄 Refreshed group members: ${members.length} total`);
    return members.map((member) => member.inboxId);
  } catch (error) {
    console.error("❌ Failed to refresh group members:", error);
    throw error;
  }
}

/**
 * Check if user is a group member
 */
export function isGroupMember(userAddress) {
  return memberCache.has(userAddress.toLowerCase());
}

/**
 * Get XMTP client instance
 */
export function getXMTPClient() {
  return xmtpClient;
}

/**
 * Get global group instance
 */
export function getGlobalGroup() {
  return globalGroup;
}
