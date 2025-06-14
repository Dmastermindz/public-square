import React, { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftRightIcon, GlobeAltIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useChatDrawer } from "../App.jsx";
import { Client } from "@xmtp/browser-sdk";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import CallAquariServer from "../api/callAquariServer.js";
import CallXMTPServer from "../api/callXMTPServer.js";

const GLOBAL_CHAT_NAME = "🌍 Public Square";
const GLOBAL_CHAT_DESCRIPTION = "The global chatroom for everyone on the platform - where humans and agents coexist!";
// Fallback group ID if backend is unavailable
const GLOBAL_GROUP_ID = "public-square-global-chat-v1";
// Well-known creator address for the global group - everyone looks for groups created by this address
const GLOBAL_GROUP_CREATOR = "0xd8da6bf26964af9d7eed9e03e53415d37aa96045"; // vitalik.eth as an example

const ChatDrawer = ({ authenticated }) => {
  const { chatDrawerOpen, setChatDrawerOpen } = useChatDrawer();
  const [selectedChat, setSelectedChat] = useState("global"); // Default to global chat
  const [xmtpClient, setXmtpClient] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [globalGroup, setGlobalGroup] = useState(null);
  const [messages, setMessages] = useState({});
  const [isInitializing, setIsInitializing] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [isJoiningGlobal, setIsJoiningGlobal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected"); // disconnected, connecting, connected, error
  const [connectionError, setConnectionError] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user } = usePrivy();
  const { wallets } = useWallets();

  // Get user address from Privy
  const address = user?.wallet?.address || wallets[0]?.address;

  // Manual retry function
  const retryConnection = () => {
    console.log("Manual retry initiated");
    setRetryCount((prev) => prev + 1);
    setXmtpClient(null);
    setConnectionStatus("disconnected");
    setConnectionError(null);
    // This will trigger the useEffect to run again
  };

  // Initialize XMTP client
  useEffect(() => {
    const initXMTP = async () => {
      if (!authenticated || !address || xmtpClient) return;

      // Check if wallet is actually available and ready
      if (!wallets || wallets.length === 0) {
        console.log("No wallets available yet, waiting...");
        setConnectionStatus("disconnected");
        return;
      }

      const wallet = wallets[0];
      if (!wallet || !wallet.address) {
        console.log("Wallet not ready yet, waiting...");
        setConnectionStatus("disconnected");
        return;
      }

      setIsInitializing(true);
      setConnectionStatus("connecting");
      setConnectionError(null);

      try {
        console.log("Initializing XMTP with address:", address);
        console.log("Wallet details:", { wallet, provider: wallet?.getEthereumProvider });
        console.log("Environment check:", {
          nodeEnv: import.meta.env.MODE,
          privyAppId: import.meta.env.VITE_PUBLIC_PRIVY_APP_ID,
          userAgent: navigator.userAgent,
          isLocalhost: window.location.hostname === "localhost",
        });

        // Get the Ethereum provider from Privy wallet
        console.log("Getting Ethereum provider from wallet...");
        const provider = await wallet.getEthereumProvider();
        console.log("Provider obtained:", { provider, methods: provider.request ? "✅" : "❌" });

        // Test the provider with a simple call first
        try {
          console.log("Testing provider connectivity...");
          const chainId = await provider.request({ method: "eth_chainId" });
          console.log("Provider test successful. Chain ID:", chainId);
        } catch (providerError) {
          console.error("Provider test failed:", providerError);
          throw new Error(`Wallet provider error: ${providerError.message}`);
        }

        // Create a signer that matches XMTP v3's expected format
        console.log("Creating XMTP-compatible signer...");
        const signer = {
          type: "EOA", // Externally Owned Account
          getIdentifier: () => {
            console.log("Signer getIdentifier called");
            return {
              identifier: address.toLowerCase(),
              identifierKind: "Ethereum", // Browser SDK expects string format
            };
          },
          signMessage: async (message) => {
            console.log("Signing message for XMTP:", message);
            try {
              // Use personal_sign method
              const signature = await provider.request({
                method: "personal_sign",
                params: [message, address],
              });
              console.log("✅ Message signed successfully");

              // Convert hex string to Uint8Array as required by XMTP v3
              const bytes = new Uint8Array(
                signature
                  .slice(2)
                  .match(/.{1,2}/g)
                  .map((byte) => parseInt(byte, 16))
              );
              return bytes;
            } catch (signError) {
              console.error("❌ Error signing message:", signError);
              throw signError;
            }
          },
        };

        console.log("Testing signer before XMTP client creation...");
        try {
          const testIdentifier = signer.getIdentifier();
          console.log("Signer test successful:", testIdentifier);
        } catch (signerError) {
          console.error("Signer test failed:", signerError);
          throw new Error(`Signer error: ${signerError.message}`);
        }

        console.log("Creating XMTP client...");

        // Simplified client creation with identity auto-creation
        const createClientWithTimeout = async () => {
          console.log("🔧 Creating XMTP client (will auto-create identity if needed)...");

          const client = await Client.create(signer, {
            env: "production", // Use production environment
          });

          console.log("✅ XMTP client created successfully");
          console.log("📋 Client properties:", Object.keys(client));
          console.log("📋 Client object:", client);
          console.log("📋 Checking address properties:", {
            address: client.address,
            inboxId: client.inboxId,
            accountAddress: client.accountAddress,
            hasSigner: !!client.signer,
            clientKeys: Object.keys(client),
          });

          // Try to get address from various client properties or signer
          let clientAddress;
          try {
            if (client.inboxId) {
              // In XMTP v3, inboxId is the primary identifier
              clientAddress = client.inboxId;
              console.log("✅ Using inboxId as identifier:", client.inboxId);
            } else if (client.address) {
              clientAddress = client.address;
            } else if (client.accountAddress) {
              clientAddress = client.accountAddress;
            } else if (client.signer && typeof client.signer.getAddress === "function") {
              clientAddress = await client.signer.getAddress();
            } else {
              // Fallback to original wallet address if client doesn't have accessible address
              clientAddress = address;
              console.log("⚠️ Using fallback wallet address for verification");
            }
          } catch (addressError) {
            console.log("⚠️ Error getting client address, using wallet address:", addressError);
            clientAddress = address;
          }

          // Basic verification - confirm client was created successfully
          if (client && clientAddress) {
            console.log("✅ XMTP client created successfully!");
            console.log("📋 Client identifier:", clientAddress);

            return client;
          } else {
            throw new Error("Failed to verify XMTP client - missing client or identifier");
          }
        };

        // Add timeout to prevent infinite hanging
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("XMTP client creation timed out after 30 seconds")), 30000));

        try {
          const client = await Promise.race([createClientWithTimeout(), timeoutPromise]);

          // Basic verification
          if (!client) {
            throw new Error("XMTP client creation failed");
          }

          // Try to get address from various possible locations
          const clientAddress = client.address || client.accountAddress || client.signer?.getAddress?.() || address; // fallback to wallet address

          console.log("✅ XMTP identity confirmed:", {
            clientAddress: clientAddress,
            userAddress: address,
            clientExists: !!client,
            clientType: typeof client,
          });

          setXmtpClient(client);
          setConnectionStatus("connected");
          console.log("✅ XMTP client initialized successfully");

          // Wait a moment for XMTP identity to propagate across the network
          console.log("⏳ Waiting for XMTP identity to propagate...");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

          // Load conversations and join/create global chat
          await loadConversations(client);
          await joinOrCreateGlobalChat(client);
        } catch (timeoutError) {
          if (timeoutError.message.includes("timed out")) {
            console.error("XMTP client creation timed out - this usually indicates network or configuration issues");
            setConnectionStatus("error");
            setConnectionError("Connection timed out. Please check your network and try again.");
          } else {
            throw timeoutError;
          }
        }
      } catch (error) {
        console.error("Failed to initialize XMTP:", error);
        setConnectionStatus("error");
        setConnectionError(error.message);
        // Reset initialization state so user can try again
        setIsInitializing(false);
      } finally {
        setIsInitializing(false);
      }
    };

    // Add a small delay to ensure wallet is fully initialized
    const timer = setTimeout(initXMTP, 1000);
    return () => clearTimeout(timer);
  }, [authenticated, address, xmtpClient, wallets, retryCount]);

  // Join the backend-managed global chat group with automatic invitations
  const joinOrCreateGlobalChat = async (client) => {
    setIsJoiningGlobal(true);
    try {
      console.log("🎯 Starting backend-managed global group join...");

      // Step 1: Get the global group ID from backend
      console.log("📡 Fetching global group info from backend...");

      let groupInfoResponse;
      let BACKEND_GROUP_ID;

      try {
        groupInfoResponse = await CallXMTPServer.get("/chat/global-group");
        console.log("📋 Full backend response:", groupInfoResponse);
        console.log("📋 Response data:", groupInfoResponse.data);
        console.log("📋 Response data structure:", Object.keys(groupInfoResponse.data));
        if (groupInfoResponse.data.data) {
          console.log("📋 Nested data:", groupInfoResponse.data.data);
          console.log("📋 Nested data keys:", Object.keys(groupInfoResponse.data.data));
        }

        BACKEND_GROUP_ID = groupInfoResponse.data.data.groupId;
        console.log("✅ Backend group info:", groupInfoResponse.data);
        console.log("🆔 Extracted groupId:", BACKEND_GROUP_ID);
      } catch (backendError) {
        console.error("❌ Failed to fetch group info from backend:", backendError);
        // Fallback to hardcoded group ID if backend is unavailable
        BACKEND_GROUP_ID = GLOBAL_GROUP_ID;
        console.log("🔄 Falling back to hardcoded group ID:", BACKEND_GROUP_ID);
      }

      // Step 2: Check if user is already in the group
      const existingGroups = await client.conversations.list();
      let publicSquareGroup = existingGroups.find((group) => group.id === BACKEND_GROUP_ID);

      if (publicSquareGroup) {
        console.log("✅ User is already in the global group!");
      } else {
        console.log("❌ User not in group yet, requesting invitation...");

        // Step 3: Request invitation from backend
        try {
          console.log("📤 Sending invitation request with data:", {
            userAddress: address,
            groupId: BACKEND_GROUP_ID,
            addressType: typeof address,
            groupIdType: typeof BACKEND_GROUP_ID,
            addressLength: address?.length,
            addressValid: /^0x[a-fA-F0-9]{40}$/.test(address),
          });

          await CallXMTPServer.post("/chat/request-invitation", {
            userAddress: address,
            groupId: BACKEND_GROUP_ID,
          });
          console.log("📤 Invitation request sent to backend");

          // Step 4: Wait a moment for invitation to be processed
          console.log("⏳ Waiting for invitation to be processed...");
          await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait 3 seconds

          // Step 5: Check again for the group
          const updatedGroups = await client.conversations.list();
          publicSquareGroup = updatedGroups.find((group) => group.id === BACKEND_GROUP_ID);

          if (!publicSquareGroup) {
            throw new Error("Invitation not received yet. Please try again in a moment.");
          }

          console.log("✅ Successfully joined group after invitation!");
        } catch (error) {
          console.error("❌ Failed to get invitation:", error);

          // Parse error response if available
          let errorMessage = "Failed to request invitation";
          let errorType = null;

          if (error.response?.data) {
            console.log("🔍 Server error response:", error.response.data);
            errorMessage = error.response.data.message || errorMessage;
            errorType = error.response.data.errorType;
          }

          // Handle specific error types
          if (errorType === "NO_XMTP_IDENTITY") {
            setConnectionError("⚠️ You need to initialize XMTP first. Please connect your wallet and create an XMTP client before joining groups.");
          } else {
            setConnectionError(`❌ ${errorMessage}`);
          }

          setIsJoiningGlobal(false);
          return; // Exit the function early to prevent publicSquareGroup undefined error
        }
      }

      // Step 6: Successfully joined - set up the group
      setGlobalGroup(publicSquareGroup);

      // Step 7: Sync with group before loading messages
      console.log("Syncing with group epoch...");
      await publicSquareGroup.sync();
      console.log("Group sync completed");

      // Step 8: Load all existing messages
      console.log("Loading existing messages...");
      const globalMessages = await publicSquareGroup.messages();
      console.log(`📨 Loaded ${globalMessages.length} existing messages`);

      setMessages((prev) => ({
        ...prev,
        global: globalMessages,
      }));

      // Step 9: Send join message for this session
      try {
        const userShort = `${address.slice(0, 6)}...${address.slice(-4)}`;
        await publicSquareGroup.send(`👋 ${userShort} has joined the Public Square!`);
        console.log("✅ Join message sent");

        // Refresh messages after sending join message
        const updatedMessages = await publicSquareGroup.messages();
        setMessages((prev) => ({
          ...prev,
          global: updatedMessages,
        }));
      } catch (welcomeError) {
        console.log("⚠️ Could not send join message:", welcomeError);
      }

      console.log("✅ Successfully joined backend-managed group:", {
        id: publicSquareGroup.id,
        name: publicSquareGroup.name || GLOBAL_CHAT_NAME,
        messageCount: globalMessages.length,
        userAddress: address,
      });
    } catch (error) {
      console.error("❌ Failed to join backend-managed global chat:", error);
      setConnectionError(`Failed to join global chat: ${error.message}`);
    } finally {
      setIsJoiningGlobal(false);
    }
  };

  // Load conversations (1:1 DMs)
  const loadConversations = async (client) => {
    try {
      console.log("Loading conversations...");
      const convos = await client.conversations.list();
      console.log("Found conversations:", convos);

      // Filter out group conversations, keep only DMs
      const dmConversations = convos.filter((convo) => convo.conversationType === "dm");
      console.log("Filtered DM conversations:", dmConversations);

      setConversations(dmConversations);

      // Load messages for each DM conversation
      const messagePromises = dmConversations.map(async (convo) => {
        console.log(`Loading messages for conversation ${convo.id}...`);
        const msgs = await convo.messages();
        console.log(`Loaded ${msgs.length} messages for conversation ${convo.id}`);
        return { conversationId: convo.id, messages: msgs };
      });

      const conversationMessages = await Promise.all(messagePromises);
      console.log("All conversation messages loaded:", conversationMessages);

      const messagesMap = {};
      conversationMessages.forEach(({ conversationId, messages }) => {
        messagesMap[conversationId] = messages;
      });

      console.log("Final messages map:", messagesMap);
      setMessages((prev) => ({ ...prev, ...messagesMap }));
    } catch (error) {
      console.error("Failed to load conversations:", error);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      console.log("Empty message, not sending");
      return;
    }

    if (!xmtpClient) {
      console.error("XMTP client not initialized");
      alert("XMTP client not connected. Please wait for connection or refresh the page.");
      return;
    }

    setIsSendingMessage(true);
    console.log("Attempting to send message:", newMessage);
    console.log("Selected chat:", selectedChat);
    console.log("Global group:", globalGroup);
    console.log("Conversations:", conversations);

    try {
      if (selectedChat === "global") {
        if (!globalGroup) {
          console.error("Global group not available");
          alert("Global chat not ready. Please wait a moment and try again.");
          return;
        }

        console.log("Sending message to global group...");
        // Send to global group
        await globalGroup.send(newMessage);
        console.log("Message sent to global group successfully");

        // Clear the input immediately
        setNewMessage("");

        // Refresh messages for global group
        console.log("Refreshing global messages...");
        const updatedMessages = await globalGroup.messages();
        console.log("Updated global messages:", updatedMessages);
        console.log("Latest message structure:", updatedMessages[updatedMessages.length - 1]);
        setMessages((prev) => ({ ...prev, global: updatedMessages }));
      } else {
        // Send to individual DM
        const conversation = conversations.find((c) => c.id === selectedChat);
        if (!conversation) {
          console.error("Conversation not found:", selectedChat);
          alert("Conversation not found. Please select a valid chat.");
          return;
        }

        console.log("Sending message to DM...");
        await conversation.send(newMessage);
        console.log("Message sent to DM successfully");

        // Clear the input immediately
        setNewMessage("");

        // Refresh messages for this conversation
        console.log("Refreshing DM messages...");
        const updatedMessages = await conversation.messages();
        console.log("Updated DM messages:", updatedMessages);
        setMessages((prev) => ({
          ...prev,
          [selectedChat]: updatedMessages,
        }));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Stream new messages
  useEffect(() => {
    if (!xmtpClient) {
      console.log("No XMTP client available for message streaming");
      return;
    }

    console.log("Setting up message stream...");
    let stream;
    const startStreaming = async () => {
      try {
        // Ensure global group is synced before starting stream
        if (globalGroup) {
          console.log("Syncing global group before starting stream...");
          await globalGroup.sync();
          console.log("Global group sync completed");
        }

        stream = await xmtpClient.conversations.streamAllMessages();
        console.log("Message stream established");

        for await (const message of stream) {
          console.log("New message received:", {
            id: message.id,
            content: message.content,
            sender: message.senderAddress,
            conversationId: message.conversationId,
            timestamp: message.sentAt,
          });

          // Check if it's from the global group
          if (globalGroup && message.conversationId === globalGroup.id) {
            console.log("Message is from global group, updating messages...");
            setMessages((prev) => {
              const updatedMessages = {
                ...prev,
                global: [...(prev.global || []), message],
              };
              console.log("Updated global messages:", updatedMessages.global);
              return updatedMessages;
            });
          } else {
            // Regular DM message
            console.log("Message is from DM, updating messages...");
            setMessages((prev) => {
              const updatedMessages = {
                ...prev,
                [message.conversationId]: [...(prev[message.conversationId] || []), message],
              };
              console.log("Updated DM messages:", updatedMessages[message.conversationId]);
              return updatedMessages;
            });
          }
        }
      } catch (error) {
        console.error("Error streaming messages:", error);
        // If we get an epoch mismatch error, try to resync
        if (error.message?.includes("epoch")) {
          console.log("Epoch mismatch detected, attempting to resync...");
          try {
            if (globalGroup) {
              await globalGroup.sync();
              console.log("Resync completed, restarting stream...");
              startStreaming(); // Restart the stream
            }
          } catch (syncError) {
            console.error("Failed to resync:", syncError);
          }
        }
      }
    };

    startStreaming();

    return () => {
      if (stream) {
        console.log("Cleaning up message stream");
        stream.return();
      }
    };
  }, [xmtpClient, globalGroup]);

  // Create new conversation (for testing)
  const createNewConversation = async (peerAddress) => {
    if (!xmtpClient) return;

    try {
      // Check if peer can be messaged
      const canMessage = await Client.canMessage([peerAddress]);
      if (!canMessage.get(peerAddress)) {
        console.log("Peer cannot receive messages on XMTP");
        return;
      }

      const conversation = await xmtpClient.conversations.newDm(peerAddress);
      await loadConversations(xmtpClient);
      console.log("New conversation created:", conversation);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Helper function to join an existing global group by ID (for future use)
  const joinGlobalGroupById = async (client, groupId) => {
    try {
      console.log(`Attempting to join global group by ID: ${groupId}`);
      // Note: This would require the group ID to be shared somehow
      // For now, we'll rely on name/description matching
      const existingGroups = await client.conversations.list();

      for (const group of existingGroups) {
        if (group.id === groupId) {
          console.log("Found group by ID:", group);
          return group;
        }
      }

      console.log("Group not found by ID");
      return null;
    } catch (error) {
      console.error("Error joining group by ID:", error);
      return null;
    }
  };

  // Format conversation display data
  const getConversationDisplayData = (conversation) => {
    const conversationMessages = messages[conversation.id] || [];
    const lastMessage = conversationMessages[conversationMessages.length - 1];

    // Helper function to safely render message content
    const getSafeMessageContent = (message) => {
      if (!message) return "No messages yet";

      if (typeof message.content === "string") {
        return message.content;
      } else if (typeof message.content === "object" && message.content !== null) {
        // Handle XMTP group metadata messages
        if (message.content.initiatedByInboxId || message.content.addedInboxes || message.content.removedInboxes) {
          return "Group updated";
        } else {
          return "Media message";
        }
      } else {
        return "Message content unavailable";
      }
    };

    return {
      id: conversation.id,
      name: conversation.peerAddress || "Unknown",
      avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${conversation.peerAddress}`,
      lastMessage: getSafeMessageContent(lastMessage),
      timestamp: lastMessage ? new Date(lastMessage.sentAt).toLocaleTimeString() : "",
      isOnline: false, // XMTP doesn't provide online status
      unreadCount: 0, // You can implement read receipts separately
    };
  };

  // Format global chat display data
  const getGlobalChatDisplayData = () => {
    const globalMessages = messages.global || [];
    const lastMessage = globalMessages[globalMessages.length - 1];

    // Helper function to safely render message content
    const getSafeMessageContent = (message) => {
      if (!message) {
        return globalGroup ? "Welcome to the Public Square!" : "Connecting...";
      }

      if (typeof message.content === "string") {
        return message.content;
      } else if (typeof message.content === "object" && message.content !== null) {
        // Handle XMTP group metadata messages
        if (message.content.initiatedByInboxId || message.content.addedInboxes || message.content.removedInboxes) {
          return "Group updated";
        } else {
          return "Media message";
        }
      } else {
        return "Message content unavailable";
      }
    };

    return {
      id: "global",
      name: GLOBAL_CHAT_NAME,
      avatar: "🌍",
      lastMessage: getSafeMessageContent(lastMessage),
      timestamp: lastMessage ? new Date(lastMessage.sentAt).toLocaleTimeString() : "",
      isOnline: true,
      unreadCount: 0,
      memberCount: globalGroup ? globalGroup.members?.length || 1 : 1,
    };
  };

  // Get connection status display
  const getConnectionStatusDisplay = () => {
    switch (connectionStatus) {
      case "connecting":
        return { text: "Connecting to XMTP...", color: "text-yellow-400", icon: "🔄" };
      case "connected":
        return { text: "Connected to XMTP Network", color: "text-green-400", icon: "🟢" };
      case "error":
        return { text: `Connection Error: ${connectionError}`, color: "text-red-400", icon: "🔴" };
      default:
        return { text: "Disconnected from XMTP", color: "text-gray-400", icon: "⚫" };
    }
  };

  // Manual group sharing helper
  const shareGroupId = () => {
    if (globalGroup) {
      const groupId = globalGroup.id;
      navigator.clipboard
        .writeText(groupId)
        .then(() => {
          alert(`Group ID copied to clipboard: ${groupId}`);
        })
        .catch(() => {
          prompt("Copy this Group ID to share:", groupId);
        });
    }
  };

  // Manual group joining helper
  const joinSharedGroup = () => {
    const groupId = prompt("Enter the Group ID to join:");
    if (groupId && groupId.trim()) {
      localStorage.setItem("public-square-global-group-id", groupId.trim());
      alert("Group ID saved! Please refresh the page to join the shared group.");
    }
  };

  if (!authenticated) {
    return null;
  }

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
  };

  const handleBackToList = () => {
    setSelectedChat(null);
  };

  const allChats = [
    // Global chat always first
    { type: "global", data: getGlobalChatDisplayData() },
    // Then individual DM conversations
    ...conversations.map((conv) => ({ type: "dm", data: getConversationDisplayData(conv), conversation: conv })),
  ];

  return (
    <div className={`fixed right-[17px] top-[80px] h-[calc(100vh-80px)] bg-[#1A2428] border-[5px] border-[#44DFE9] transition-all duration-300 ease-in-out z-20 ${chatDrawerOpen ? "w-[569px]" : "w-12"} rounded-[17px]`}>
      {/* Toggle Button */}
      <button
        onClick={() => setChatDrawerOpen(!chatDrawerOpen)}
        className="absolute left-0 top-20 -translate-x-full bg-[#1A2428] border border-[#44DFE9] rounded-l-md p-2 hover:bg-[#44DFE9]/20 transition-colors z-20">
        {chatDrawerOpen ? <ChevronRightIcon className="w-4 h-4 text-white" /> : <ChevronLeftIcon className="w-4 h-4 text-white" />}
      </button>

      {/* Content starts after navbar height */}
      <div className="h-full">
        {/* Collapsed State */}
        {!chatDrawerOpen && (
          <div className="flex flex-col items-center gap-4 p-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
            {/* Global chat icon */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] rounded-full flex items-center justify-center text-[#7B81D6] font-bold">🌍</div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFDB1E] rounded-full"></div>
            </div>
            {/* Individual DM previews */}
            {conversations.slice(0, 2).map((conversation) => {
              const displayData = getConversationDisplayData(conversation);
              return (
                <div
                  key={conversation.id}
                  className="relative">
                  <img
                    src={displayData.avatar}
                    alt={displayData.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {displayData.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF26DC] rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">{displayData.unreadCount}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Expanded State */}
        {chatDrawerOpen && (
          <div className="flex flex-col h-full w-full">
            {!selectedChat ? (
              // Chat List View
              <>
                <div className="p-4 border-b border-[#ABABF9]">
                  <h3 className="text-4xl font-bold text-white flex items-center">
                    <ChatBubbleLeftRightIcon className="w-8 h-8 mr-2" />
                    Public Square Chat
                  </h3>

                  {/* Enhanced Connection Status */}
                  <div className="mt-2 space-y-1">
                    {(() => {
                      const statusDisplay = getConnectionStatusDisplay();
                      return (
                        <p className={`text-base ${statusDisplay.color} flex items-center`}>
                          <span className="mr-1">{statusDisplay.icon}</span>
                          {statusDisplay.text}
                        </p>
                      );
                    })()}

                    {/* Additional status info */}
                    {isInitializing && <p className="text-base text-[#27BBFB]">🔄 Initializing XMTP client...</p>}
                    {isJoiningGlobal && <p className="text-base text-[#FFDB1E]">🌍 Joining Public Square...</p>}
                    {globalGroup && <p className="text-base text-[#FF26DC]">✅ Global chat ready</p>}

                    {/* Development Debug Info */}
                    {import.meta.env.MODE === "development" && (
                      <div className="bg-[rgba(255,255,255,0.11)] p-3 text-base text-white border-2 border-[#ABABF9] rounded-2xl mb-4">
                        <div>
                          <strong>Debug Info:</strong>
                        </div>
                        <div>Wallet: {address}</div>
                        <div>Conversations: {Object.keys(messages).length}</div>
                        <div>Global Group: {globalGroup ? "Connected" : "Not connected"}</div>
                        <div>Retry Count: {retryCount}</div>
                        {globalGroup && (
                          <>
                            <div>Group ID: {globalGroup.id}</div>
                            <div>Members: {globalGroup.members?.length || "unknown"}</div>
                            <div className="mt-2 space-x-2">
                              <button
                                onClick={shareGroupId}
                                className="px-6 py-4 bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] text-[#7B81D6] text-base font-semibold rounded-xl hover:opacity-90">
                                📋 Copy Group ID
                              </button>
                              <button
                                onClick={joinSharedGroup}
                                className="px-6 py-4 border-2 border-[#ECECFF] bg-transparent text-base font-semibold bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] bg-clip-text text-transparent rounded-xl">
                                🔗 Join Group ID
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Retry button for failed connections */}
                    {(connectionStatus === "error" || (connectionStatus === "connecting" && retryCount === 0)) && (
                      <button
                        onClick={retryConnection}
                        className="mt-2 px-6 py-4 bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] text-[#7B81D6] text-base font-semibold rounded-xl hover:opacity-90">
                        {connectionStatus === "error" ? "Retry Connection" : "Reset & Retry"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  {!globalGroup && !isInitializing ? (
                    <div className="p-4 text-center text-text-secondary">
                      <p>Connecting to Public Square...</p>
                      <p className="text-xs mt-2">The global chatroom is loading!</p>
                    </div>
                  ) : (
                    allChats.map((chat) => {
                      const { type, data } = chat;
                      const isGlobal = type === "global";

                      return (
                        <div
                          key={data.id}
                          onClick={() => handleChatSelect(data.id)}
                          className={`flex items-center p-3 hover:bg-accent-purple hover:bg-opacity-20 cursor-pointer border-b border-border-color border-opacity-30 ${isGlobal ? "bg-gradient-to-r from-purple-500/10 to-blue-500/10" : ""}`}>
                          <div className="relative">
                            {isGlobal ? (
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">🌍</div>
                            ) : (
                              <img
                                src={data.avatar}
                                alt={data.name}
                                className="w-10 h-10 rounded-full"
                              />
                            )}
                            {isGlobal && <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>}
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <p className={`text-sm font-medium truncate ${isGlobal ? "text-purple-400" : "text-text-primary"}`}>{isGlobal ? data.name : `${data.name.slice(0, 6)}...${data.name.slice(-4)}`}</p>
                                {isGlobal && (
                                  <span className="text-xs text-text-secondary flex items-center">
                                    <UserGroupIcon className="w-3 h-3 mr-1" />
                                    {data.memberCount}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-text-secondary">{data.timestamp}</span>
                            </div>
                            <p className="text-sm text-text-secondary truncate">{data.lastMessage}</p>
                          </div>
                          {data.unreadCount > 0 && (
                            <div className="ml-2 w-5 h-5 bg-accent-purple rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">{data.unreadCount}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            ) : (
              // Individual Chat View
              <div className="flex flex-col h-full w-full">
                <div className="p-4 border-b border-[#ABABF9] flex items-center">
                  <button
                    onClick={handleBackToList}
                    className="mr-3 p-2 hover:bg-[rgba(255,255,255,0.11)] rounded-xl">
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                  <div className="flex items-center">
                    {selectedChat === "global" ? (
                      <>
                        <div className="w-10 h-10 bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] rounded-full flex items-center justify-center text-[#7B81D6] font-bold mr-3">🌍</div>
                        <div>
                          <h4 className="text-xl font-semibold text-[#ECECFF]">{GLOBAL_CHAT_NAME}</h4>
                          <span className="text-base text-[#ABABF9] flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-1" />
                            Global Community Chat
                          </span>
                        </div>
                      </>
                    ) : (
                      (() => {
                        const conversation = conversations.find((c) => c.id === selectedChat);
                        const displayData = conversation ? getConversationDisplayData(conversation) : null;
                        return displayData ? (
                          <>
                            <img
                              src={displayData.avatar}
                              alt={displayData.name}
                              className="w-10 h-10 rounded-full mr-3"
                            />
                            <div>
                              <h4 className="text-xl font-semibold text-white">
                                {displayData.name.slice(0, 6)}...{displayData.name.slice(-4)}
                              </h4>
                              <span className="text-base text-[#ABABF9]">Direct Message</span>
                            </div>
                          </>
                        ) : null;
                      })()
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-4">
                  {((selectedChat === "global" ? messages.global : messages[selectedChat]) || []).map((message, index) => {
                    const messageSender = message.senderInboxId || message.senderAddress || message.sender;
                    const isMyMessage = messageSender === address || message.senderInboxId === user?.id;
                    const senderShort = messageSender ? `${messageSender.slice(0, 6)}...${messageSender.slice(-4)}` : "Unknown";

                    const renderContent = () => {
                      if (typeof message.content === "string") {
                        return message.content;
                      } else if (typeof message.content === "object" && message.content !== null) {
                        if (message.content.initiatedByInboxId || message.content.addedInboxes || message.content.removedInboxes) {
                          const { initiatedByInboxId, addedInboxes, removedInboxes, metadataFieldChanges } = message.content;

                          if (addedInboxes && addedInboxes.length > 0) {
                            return `👋 New member joined the group`;
                          } else if (removedInboxes && removedInboxes.length > 0) {
                            return `👋 Member left the group`;
                          } else if (metadataFieldChanges) {
                            return `📝 Group settings updated`;
                          } else {
                            return `🔄 Group updated`;
                          }
                        } else {
                          return `📎 ${message.contentType || "Media message"}`;
                        }
                      } else {
                        return "Message content unavailable";
                      }
                    };

                    return (
                      <div
                        key={`${message.id || index}`}
                        className={`flex ${isMyMessage ? "justify-end" : "justify-start"} mb-4`}>
                        <div className={`max-w-xs px-6 py-4 rounded-2xl ${isMyMessage ? "bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] text-[#7B81D6] rounded-tr-none" : "bg-[#2A3438] text-white rounded-tl-none"}`}>
                          {selectedChat === "global" && !isMyMessage && <p className="text-sm text-[#ABABF9] mb-1">{senderShort}</p>}
                          <p className="text-base">{renderContent()}</p>
                          <span className="text-xs text-[#ABABF9] mt-1 block text-right">{new Date(message.sentAt || message.timestamp || Date.now()).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#ABABF9]">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !isSendingMessage && handleSendMessage()}
                      placeholder={selectedChat === "global" ? "Message the Public Square..." : "Type a message..."}
                      disabled={isSendingMessage || connectionStatus !== "connected"}
                      className="flex-1 px-6 py-4 bg-[rgba(255,255,255,0.11)] border-2 border-[#ABABF9] rounded-xl text-white placeholder-[#ABABF9] focus:outline-none focus:border-[#ECECFF] text-base disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={isSendingMessage || !newMessage.trim() || connectionStatus !== "connected"}
                      className="px-6 py-4 bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] text-[#7B81D6] text-base font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                      {isSendingMessage ? "Sending..." : "Send"}
                    </button>
                  </div>

                  {/* Connection status in chat input area */}
                  {connectionStatus !== "connected" && (
                    <div className="mt-2 text-base text-center">
                      {(() => {
                        const statusDisplay = getConnectionStatusDisplay();
                        return (
                          <span className={statusDisplay.color}>
                            {statusDisplay.icon} {statusDisplay.text}
                          </span>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDrawer;
