import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { useChatDrawer } from "../App.jsx";

const ChatDrawer = ({ authenticated }) => {
  const { chatDrawerOpen, setChatDrawerOpen } = useChatDrawer();
  const [selectedChat, setSelectedChat] = useState(null);

  // Mock chat data
  const mockChats = [
    {
      id: 1,
      name: "Alice Chen",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Alice Chen",
      lastMessage: "Hey! Did you see the new thread about DeFi?",
      timestamp: "2m ago",
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: 2,
      name: "Bob Wilson",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Bob Wilson",
      lastMessage: "Thanks for the explanation on Layer 2!",
      timestamp: "1h ago",
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 3,
      name: "Carol Davis",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Carol Davis",
      lastMessage: "Can we discuss this in the governance channel?",
      timestamp: "3h ago",
      isOnline: true,
      unreadCount: 1,
    },
    {
      id: 4,
      name: "Dave Miller",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Dave Miller",
      lastMessage: "The new proposal looks interesting",
      timestamp: "1d ago",
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 5,
      name: "Eva Rodriguez",
      avatar: "https://api.dicebear.com/6.x/initials/svg?seed=Eva Rodriguez",
      lastMessage: "Let's schedule a call about the roadmap",
      timestamp: "2d ago",
      isOnline: true,
      unreadCount: 0,
    },
  ];

  // Mock chat messages for selected chat
  const mockMessages = {
    1: [
      { id: 1, sender: "Alice Chen", message: "Hey! How are you doing?", timestamp: "10:30 AM", isMine: false },
      { id: 2, sender: "You", message: "I'm good! Just checking out the forum", timestamp: "10:32 AM", isMine: true },
      { id: 3, sender: "Alice Chen", message: "Did you see the new thread about DeFi?", timestamp: "10:33 AM", isMine: false },
      { id: 4, sender: "Alice Chen", message: "It's really interesting", timestamp: "10:33 AM", isMine: false },
    ],
    2: [
      { id: 1, sender: "Bob Wilson", message: "Thanks for the explanation on Layer 2!", timestamp: "9:15 AM", isMine: false },
      { id: 2, sender: "You", message: "No problem! Happy to help", timestamp: "9:16 AM", isMine: true },
    ],
    3: [{ id: 1, sender: "Carol Davis", message: "Can we discuss this in the governance channel?", timestamp: "7:45 AM", isMine: false }],
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

  return (
    <div className={`fixed right-0 top-0 h-screen bg-secondary-bg border-l border-border-color transition-all duration-300 ease-in-out z-30 ${chatDrawerOpen ? "w-480" : "w-12"}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setChatDrawerOpen(!chatDrawerOpen)}
        className="absolute left-0 top-20 -translate-x-full bg-secondary-bg border border-border-color rounded-l-md p-2 hover:bg-accent-purple hover:bg-opacity-20 transition-colors z-10">
        {chatDrawerOpen ? <ChevronRightIcon className="w-4 h-4 text-text-primary" /> : <ChevronLeftIcon className="w-4 h-4 text-text-primary" />}
      </button>

      {/* Content starts after navbar height */}
      <div className="pt-[80px] h-full">
        {/* Collapsed State */}
        {!chatDrawerOpen && (
          <div className="flex flex-col items-center p-2 space-y-3 mt-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-text-primary" />
            {mockChats.slice(0, 3).map((chat) => (
              <div
                key={chat.id}
                className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-8 h-8 rounded-full"
                />
                {chat.isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary-bg"></div>}
                {chat.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white">{chat.unreadCount}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Expanded State */}
        {chatDrawerOpen && (
          <div className="flex flex-col h-full w-full">
            {!selectedChat ? (
              // Chat List View
              <>
                <div className="p-4 border-b border-border-color">
                  <h3 className="text-lg font-semibold text-text-primary flex items-center">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Chats
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto hide-scrollbar">
                  {mockChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className="flex items-center p-3 hover:bg-accent-purple hover:bg-opacity-20 cursor-pointer border-b border-border-color border-opacity-30">
                      <div className="relative">
                        <img
                          src={chat.avatar}
                          alt={chat.name}
                          className="w-10 h-10 rounded-full"
                        />
                        {chat.isOnline && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-secondary-bg"></div>}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-text-primary truncate">{chat.name}</p>
                          <span className="text-xs text-text-secondary">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-text-secondary truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2 w-5 h-5 bg-accent-purple rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">{chat.unreadCount}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              // Individual Chat View
              <div className="flex flex-col h-full w-full">
                <div className="p-4 border-b border-border-color flex items-center">
                  <button
                    onClick={handleBackToList}
                    className="mr-3 p-1 hover:bg-accent-purple hover:bg-opacity-20 rounded">
                    <ChevronLeftIcon className="w-4 h-4 text-text-primary" />
                  </button>
                  <div className="flex items-center">
                    <img
                      src={mockChats.find((c) => c.id === selectedChat)?.avatar}
                      alt={mockChats.find((c) => c.id === selectedChat)?.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-text-primary">{mockChats.find((c) => c.id === selectedChat)?.name}</h4>
                      <span className="text-xs text-green-400">{mockChats.find((c) => c.id === selectedChat)?.isOnline ? "Online" : "Offline"}</span>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
                  {(mockMessages[selectedChat] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${message.isMine ? "bg-accent-purple text-white" : "bg-accent-purple bg-opacity-20 text-text-primary"}`}>
                        <p className="text-sm">{message.message}</p>
                        <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border-color">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 bg-accent-purple bg-opacity-20 border border-accent-purple border-opacity-30 rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:border-accent-purple text-sm"
                    />
                    <button className="px-3 py-2 bg-accent-purple text-white rounded-lg hover:bg-accent-dark transition-colors text-sm">Send</button>
                  </div>
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
