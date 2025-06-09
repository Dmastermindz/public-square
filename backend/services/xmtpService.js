import { Client } from "@xmtp/node-sdk";
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

  let memberCount = 0;
  try {
    const members = await globalGroup.members();
    memberCount = members.length;
  } catch (error) {
    console.warn("⚠️ Failed to get member count:", error.message);
  }

  return {
    groupId: globalGroup.id,
    masterAddress: masterWallet?.address,
    groupName: globalGroup.name || process.env.GLOBAL_GROUP_NAME,
    description: globalGroup.description || process.env.GLOBAL_GROUP_DESCRIPTION,
    memberCount: memberCount,
  };
}

/**
 * Add a user to the global group (send invitation)
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

    // Add member to group (this sends the invitation)
    await globalGroup.addMembers([userAddress]);

    // Update caches
    memberCache.add(normalizedAddress);
    invitationQueue.set(normalizedAddress, now);

    console.log(`✅ Invitation sent successfully to ${userAddress}`);

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
