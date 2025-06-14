import React, { useState, createContext, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { PrivyProvider, usePrivy } from "@privy-io/react-auth";
import Navbar from "./components/Navbar.jsx";
import ChatDrawer from "./components/ChatDrawer.jsx";
import Forum from "./pages/Forum.jsx";
import ThreadList from "./pages/ThreadList.jsx";
import ThreadPage from "./pages/ThreadPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import Announcement from "./components/AnnouncementBanner.jsx";

// Create context for ChatDrawer state
const ChatDrawerContext = createContext();

export const useChatDrawer = () => {
  const context = useContext(ChatDrawerContext);
  if (!context) {
    throw new Error("useChatDrawer must be used within a ChatDrawerProvider");
  }
  return context;
};

function AppContent() {
  const { authenticated } = usePrivy();
  const [chatDrawerOpen, setChatDrawerOpen] = useState(true);

  // Calculate margin based on authentication and chat drawer state
  const getMainContentStyle = () => {
    if (!authenticated) return {};
    return {
      marginRight: chatDrawerOpen ? "480px" : "48px", // w-480 = 480px, w-12 = 48px
    };
  };

  return (
    <ChatDrawerContext.Provider value={{ chatDrawerOpen, setChatDrawerOpen }}>
      <div className="h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex flex-col">
        <Navbar />
        <div className="flex flex-1 pt-[70px]">
          {/* Main Content - Only this area should scroll */}
          <main
            className="flex-1 min-w-0 h-full overflow-hidden transition-all duration-300 ease-in-out"
            style={getMainContentStyle()}>
            <div className="h-full overflow-y-auto hide-scrollbar">
              <Routes>
                <Route
                  path="/"
                  element={<Forum />}
                />
                <Route
                  path="/category/:categoryId"
                  element={<ThreadList />}
                />
                <Route
                  path="/thread/:threadId"
                  element={<ThreadPage />}
                />
                <Route
                  path="/signin"
                  element={<SignIn />}
                />
              </Routes>
            </div>
          </main>
        </div>

        {/* Fixed Right Side Chat Drawer */}
        {authenticated && <ChatDrawer authenticated={authenticated} />}
      </div>
    </ChatDrawerContext.Provider>
  );
}

function App() {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PUBLIC_PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#8B5CF6",
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}>
      <AppContent />
    </PrivyProvider>
  );
}

export default App;
