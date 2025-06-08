import React, { useState, useEffect, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import { usePrivy, useWallets } from "@privy-io/react-auth";

// Import Privy Provider
import PrivyProviderComponent from "./providers/PrivyProvider.jsx";

// Import Components
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";

// Import Pages
import Forum from "./pages/Forum.jsx";
import ThreadList from "./pages/ThreadList.jsx";
import ThreadPage from "./pages/ThreadPage.jsx";
import SignIn from "./pages/SignIn.jsx";

// Create Contexts
const BlockchainContext = createContext({});
const PrivyContext = createContext({});

export { BlockchainContext, PrivyContext };

function AppContent() {
  // Privy state
  const [embeddedWallet, setEmbeddedWallet] = useState("");
  const [linkedWallet, setLinkedWallet] = useState("");
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState("");
  const [linkedWalletAddress, setLinkedWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const { wallets } = useWallets();
  const { user, login, logout, ready, authenticated } = usePrivy();

  // Navigation state
  const [selected, setSelected] = useState("Sign In");

  // Forum state
  const [activeCategoryId, setActiveCategoryId] = useState(1);
  const [activeTopicId, setActiveTopicId] = useState(1);
  const [activePostId, setActivePostId] = useState(null);
  const [activeTopicTitle, setActiveTopicTitle] = useState("");

  // Privy Setup
  useEffect(() => {
    if (!ready || !authenticated) {
      return;
    } else {
      setUp();
    }

    async function setUp() {
      const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
      const linkedWallet = wallets.find((wallet) => wallet.walletClientType === "metamask");

      if (embeddedWallet) {
        const provider = await embeddedWallet.getEthereumProvider();

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x2105` }], // BASE Chain Mainnet
        });

        const ethProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethProvider.getSigner();
        const walletBalance = await ethProvider.getBalance(embeddedWallet.address);
        const ethStringAmount = ethers.utils.formatEther(walletBalance);

        setWalletBalance(ethStringAmount);
        setEmbeddedWallet(embeddedWallet);
        setEmbeddedWalletAddress(embeddedWallet.address);

        if (linkedWallet) {
          setLinkedWallet(linkedWallet);
          setLinkedWalletAddress(linkedWallet.address);
        }

        console.log("Privy Embedded Wallet Address:", embeddedWallet);
        console.log("Privy Embedded Wallet Balance:", ethStringAmount);
      }

      if (!embeddedWallet && linkedWallet) {
        const provider = await linkedWallet.getEthereumProvider();

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x2105` }], // BASE Chain Mainnet
        });

        const ethProvider = new ethers.providers.Web3Provider(provider);
        const signer = ethProvider.getSigner();
        const walletBalance = await ethProvider.getBalance(linkedWallet.address);
        const ethStringAmount = ethers.utils.formatEther(walletBalance);

        setWalletBalance(ethStringAmount);
        setLinkedWallet(linkedWallet);
        setLinkedWalletAddress(linkedWallet.address);

        console.log("Privy Linked Wallet:", linkedWallet);
        console.log("Privy Linked Wallet Balance:", ethStringAmount);
      }
    }
  }, [wallets, ready]);

  // Auto-navigate on authentication change
  useEffect(() => {
    if (authenticated && selected === "Sign In") {
      setSelected("Forum");
    }
    if (!authenticated && selected !== "Sign In") {
      setSelected("Sign In");
    }
  }, [authenticated, selected]);

  // Render content based on selected page
  const renderContent = () => {
    switch (selected) {
      case "Forum":
        return <Forum />;
      case "Thread List":
        return <ThreadList />;
      case "Thread Page":
        return <ThreadPage />;
      default:
        return <SignIn setSelected={setSelected} />;
    }
  };

  return (
    <PrivyContext.Provider value={{ login, logout, ready, authenticated }}>
      <BlockchainContext.Provider
        value={{
          user,
          embeddedWalletAddress,
          linkedWalletAddress,
          walletBalance,
          setSelected,
          activeCategoryId,
          setActiveCategoryId,
          activeTopicId,
          setActiveTopicId,
          activePostId,
          setActivePostId,
          activeTopicTitle,
          setActiveTopicTitle,
        }}>
        <div className="flex map-container full-height overflow-hidden">
          {/* Navbar */}
          <div className="w-full z-40 fixed">
            <Navbar
              selected={selected}
              setSelected={setSelected}
              authenticated={authenticated}
              login={login}
              logout={logout}
              ready={ready}
              embeddedWallet={embeddedWallet}
              linkedWallet={linkedWallet}
            />
          </div>

          {/* Sidebar */}
          <div className="h-full flex-row">
            <Sidebar
              authenticated={authenticated}
              selected={selected}
              setSelected={setSelected}
              embeddedWallet={embeddedWallet}
              linkedWallet={linkedWallet}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-primary-bg flex-grow flex flex-col map-container overflow-x-hidden mt-[60px] sm:mt-[80px]">{renderContent()}</div>
        </div>
      </BlockchainContext.Provider>
    </PrivyContext.Provider>
  );
}

function App() {
  return (
    <div className="map-container">
      <PrivyProviderComponent>
        <AppContent />
      </PrivyProviderComponent>
    </div>
  );
}

export default App;
