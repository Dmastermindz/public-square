import React from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import ReactMapGL, { FullscreenControl } from "react-map-gl";
import { usePrivy, useWallets } from "@privy-io/react-auth";

const ActiveContext = createContext(3);
const ProposalContext = createContext({}); //Must Create Context to pass varibales down component tree
const VoterContext = createContext({});
const BlockchainContext = createContext({});
const PrivyContext = createContext({});

export { ActiveContext };
export { ProposalContext }; //Must Export Context To Use Outside of File
export { VoterContext };
export { BlockchainContext };
export { PrivyContext };

// Import Components
import Navbar from "../components/navbar.jsx";
import { signer, provider } from "../components/navbar.jsx";
import Sidebar from "../components/sidebar.jsx";
import SidebarMobile from "../components/sidebarMobile.jsx";
console.log("logging provider", provider);

//Import Viewport Page
import Swap from "../viewports/swap.jsx";
import BuyAquari from "../viewports/swapBog.jsx";
import Home from "../viewports/Home/home.jsx";
import HomeArticle from "../viewports/Home/homeArticle.jsx";
import AquaVote from "../viewports/Vote/aquaVote.jsx";
import AquaVote2 from "../viewports/Vote/aquaVote2.jsx";
import Stake from "../viewports/stake.jsx";
import CleanupMap from "../viewports/cleanupMap.jsx";
import DAOFinancials from "../viewports/daoFinancials.jsx";
import Forum from "../viewports/Forum/forum.jsx";
import Wiki from "../viewports/wiki.jsx";
import SignIn from "../viewports/Home/signIn.jsx";
import ThreadList from "../viewports/Forum/threadList.jsx";
import ThreadPage from "../viewports/Forum/threadPage.jsx";
import UserProfile from "../viewports/Forum/userProfile.jsx";
import UserSearch from "../viewports/Forum/userSearch.jsx";
import UserLeaderboard from "../viewports/Forum/userLeaderboard.jsx";
import PaymentDashboard from "../viewports/paymentDashboard.jsx";

//Global Variables
let privySigner;

const home = () => {
  //Initalize Privy Wallets & State
  const [embeddedWallet, setEmbeddedWallet] = useState("");
  const [linkedWallet, setLinkedWallet] = useState("");
  const [embeddedWalletAddress, setEmbeddedWalletAddress] = useState("");
  const [linkedWalletAddress, setLinkedWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState("");
  const { wallets } = useWallets();
  const { user, login, logout, ready, authenticated } = usePrivy();

  if (ready && authenticated) {
    console.log("Privy is Online & Ready. User Logged In");
  }

  //State for Active Blockchain Proposal
  const [activePage, setActivePage] = useState(0); //use this one
  const [iterationState, setIterationState] = useState(0); //iteration counter for votedDisplay component

  //State for News Article Pages
  const [newsObject, setNewsObject] = useState({
    headline: "Error Downloading Article",
    category: null,
    image: null,
    date: "N/A",
    article_text: "Aquari Failed to Load the Article, Please Restart the App.",
  });

  //State for Naviagtion
  const [selected, setSelected] = useState("Sign In");
  const [jsx, setJsx] = useState(<SignIn />);
  const [mobileNav, setMobileNav] = useState(false);

  //State for Forums (For Now we Attach to Blockchain Context)
  const [activeCategoryId, setActiveCategoryId] = useState(1); //See API for Values (*Actaully Forum_Id)
  const [activeTopicId, setActiveTopicId] = useState(1); //See API for Values
  const [activePostId, setActivePostId] = useState(1); //See API for Values (Used for knowing what post to quote etc)
  const [activeTopicTitle, setActiveTopicTitle] = useState(1); //See API for Values (Topic Title)

  //State for Pulled Blockchain Data
  const [getProposalFunc, setGetProposalFunc] = useState("N/A");
  const [getProposalsFunc, setGetProposalsFunc] = useState([]);
  const [getVotesOfFunc, setGetVotesOfFunc] = useState("N/A");
  const [pieVotes, setPieVotes] = useState(1);
  const [connectedWallet, setConnectedWallet] = useState("Disconnected");

  //Privy Setup UseEffect (Load Wallet Provider and set Wallet States from Above)
  useEffect(() => {
    if (!ready || !authenticated) {
      return;
    } else {
      setUp();
    }
    async function setUp() {
      const embeddedWallet = wallets.find((wallet) => wallet.walletClientType === "privy");
      const linkedWalletz = wallets.find((wallet) => wallet.walletClientType === "metamask");
      // const linkedWalletz = wallets.find((wallet) => {
      //   if (wallet.walletClientType === "metamask" || wallet.walletClientType === "trustwallet") {
      //     return true;
      //   }

      //   if (wallet.walletInfo && wallet.walletInfo.hasOwnProperty("isTrustWallet") && wallet.walletInfo.isTrustWallet) {
      //     return true;
      //   }

      //   return false;
      // });

      if (embeddedWallet) {
        const provider = await embeddedWallet.getEthereumProvider();

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x2105` }], //BASE Chain Mainnet
        });
        const ethProvider = new ethers.providers.Web3Provider(provider);
        privySigner = ethProvider.getSigner();
        const walletBalance = await ethProvider.getBalance(embeddedWallet.address);
        const ethStringAmount = ethers.utils.formatEther(walletBalance);
        setWalletBalance(ethStringAmount);
        setEmbeddedWallet(embeddedWallet);
        setEmbeddedWalletAddress(embeddedWallet.address);
        linkedWallet ? setLinkedWallet(linkedWalletz) : null;
        linkedWallet ? setLinkedWalletAddress(linkedWalletz.address) : null;

        console.log("Privy Embedded Wallet Address:", embeddedWallet);
        console.log("Privy Embedded Wallet Balance:", ethStringAmount);
        console.log("Privy Linked Wallet:", linkedWalletz);
        console.log("PrivySigner Object:", privySigner);
      }

      if (!embeddedWallet) {
        const provider = await linkedWalletz.getEthereumProvider();

        await provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x2105` }], //BASE Chain Mainnet
        });
        const ethProvider = new ethers.providers.Web3Provider(provider);
        privySigner = ethProvider.getSigner();
        const walletBalance = await ethProvider.getBalance(linkedWalletz.address);
        const ethStringAmount = ethers.utils.formatEther(walletBalance);
        setWalletBalance(ethStringAmount);
        setLinkedWallet(linkedWalletz);
        setLinkedWalletAddress(linkedWalletz.address);

        console.log("Privy Embedded Wallet Address:", embeddedWallet);

        console.log("Privy Linked Wallet:", linkedWalletz);
        console.log("Privy Linked Wallet Address:", linkedWalletz.address);
        console.log("Privy Linked Wallet Balance:", ethStringAmount);
        console.log("PrivySigner Object:", privySigner);
      }
    }
  }, [wallets, ready]);

  useEffect(() => {
    switch (selected) {
      case "Swap":
        setJsx(
          <div className="">
            <Swap />
          </div>
        );
        break;
      case "Home":
        console.log("Case Home Linked:", linkedWallet.address);
        console.log("Case Home Embedded:", embeddedWallet.address);
        setJsx(
          <Home
            selected={selected}
            ready={ready}
            linkedWalletAddress={linkedWallet.address}
            embeddedWalletAddress={embeddedWallet.address}
            setNewsObject={setNewsObject}
            setSelected={setSelected}
          />
        );
        break;
      case "Sign In":
        setJsx(
          <SignIn
            auth={authenticated} //Privy Authenticated
            login={login} //Privy Login
            logout={logout} //Privy Logout
            setSelected={setSelected}
            selected={selected}
            ready={ready}
            linkedWalletAddress={linkedWallet.address}
            embeddedWalletAddress={embeddedWallet.address}
            setNewsObject={setNewsObject}
          />
        );
        break;
      case "Buy Aquari":
        setJsx(<BuyAquari setSelected={setSelected} />);
        break;
      case "HomeArticle":
        setJsx(
          <HomeArticle
            newsObject={newsObject}
            setSelected={setSelected}
          />
        );
        break;
      case "AquaVote":
        setJsx(
          <AquaVote
            lolz={setPieVotes}
            getProposalsFunc={getProposalsFunc}
            selected={selected}
            setSelected={setSelected}
            jsx={jsx}
          />
        );
        break;
      case "AquaVote2":
        setJsx(
          <AquaVote2
            pieVotez={pieVotes}
            setActivePage={setActivePage}
            activePage={activePage}
            selected={selected}
            setSelected={setSelected}
            jsx={jsx}
            getProposalFunc={getProposalFunc}
            getProposalsFunc={getProposalsFunc}
            getVotesOfFunc={getVotesOfFunc}
          />
        );
        break;
      case "Stake":
        setJsx(
          <div className="map-container">
            <Stake />
          </div>
        );
        break;
      case "Cleanup Map":
        setJsx(
          <div className="bg-[#191b2c] h-full w-full overflow-y-hidden  rounded-b-none map-container rounded-r-none">
            <ReactMapGL
              initialViewState={{
                longitude: 0.1276,
                latitude: 51.5072,
                zoom: 4.4,
              }}
              // style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/dmastermind/clfn80l9800d201qiaud2dayd"
              // mapStyle="mapbox://styles/mapbox/dark-v10"
              mapboxAccessToken="pk.eyJ1IjoiZG1hc3Rlcm1pbmQiLCJhIjoiY2xmbjd0eHF5MGpuMTNycDYzZnZvY2NsNCJ9.vSsm8I_l-DQNPh0Q-vS0dQ"
              //{...viewport}  -- for Applicaiton Controlled Map
            ></ReactMapGL>
          </div>
        );
        break;
      case "DAO Financials":
        setJsx(<DAOFinancials />); //Switch Back to <PaymentDashboard /> Component when switching to Shield.
        break;
      case "Forum":
        setJsx(<Forum />);
        break;
      case "Thread List":
        setJsx(<ThreadList />);
        break;
      case "Thread Page":
        setJsx(<ThreadPage />);
        break;
      case "User Profile":
        setJsx(<UserProfile />);
        break;
      case "User Search":
        setJsx(<UserSearch />);
        break;
      case "User Leaderboard":
        setJsx(<UserLeaderboard />);
        break;
      case "Wiki":
        setJsx(<Wiki />);
        break;
      default:
        setJsx(<Swap />);
    }
  }, [selected, linkedWallet]); // This effect runs whenever 'selected' changes

  useEffect(() => {
    //Change Page On SignIn
    if (authenticated == true && selected == "Sign In") {
      setSelected("Home");
    }

    if (authenticated == false && selected == "Home") {
      console.log("Selected Set to Sign In");
      setSelected("Sign In");
    }
  }, [authenticated, selected]);

  console.log(selected);

  return (
    <>
      <PrivyContext.Provider value={{ login, logout, ready, authenticated }}>
        <BlockchainContext.Provider value={{ user, privySigner, provider, embeddedWalletAddress, linkedWalletAddress, walletBalance, setSelected, activeCategoryId, setActiveCategoryId, activeTopicId, setActiveTopicId, activePostId, setActivePostId, activeTopicTitle, setActiveTopicTitle }}>
          <VoterContext.Provider value={{ getVotesOfFunc, setGetVotesOfFunc }}>
            <ProposalContext.Provider
              value={{
                getProposalsFunc,
                setGetProposalsFunc,
                getProposalFunc,
                setGetProposalFunc,
              }}>
              <ActiveContext.Provider value={{ activePage, setActivePage }}>
                <div className="flex map-container full-height overflow-hidden">
                  {mobileNav ? (
                    <SidebarMobile
                      authenticated={authenticated} //Is Privy User Authenticated?
                      linkedWallet={linkedWallet} //Privy External Wallet Connection
                      embeddedWallet={embeddedWallet} //Privy Embedded Wallet Connection
                      setMobileNav={setMobileNav}
                      connectedWallet={connectedWallet}
                      selected={selected}
                      setSelected={setSelected}
                      jsx={jsx}
                    />
                  ) : null}

                  <div className="w-full z-40 fixed">
                    <Navbar
                      setJsx={setJsx}
                      setSelected={setSelected}
                      setNewsObject={setNewsObject}
                      selected={selected}
                      ready={ready}
                      linkedWallet={linkedWallet}
                      embeddedWallet={embeddedWallet}
                      authenticated={authenticated} //Privy Authenticated
                      login={login} //Privy Login
                      logout={logout} //Privy Logout
                      getProposalsFunc={getProposalsFunc}
                      connectedWallet={connectedWallet}
                      setConnectedWallet={setConnectedWallet}
                      mobileNav={mobileNav}
                      setMobileNav={setMobileNav}
                      activePage={activePage}
                      getProposalFunc={getProposalFunc}
                      setGetProposalFunc={setGetProposalFunc}
                      setGetProposalsFunc={setGetProposalsFunc}
                      setGetVotesOfFunc={setGetVotesOfFunc}
                    />
                  </div>

                  <div
                    className="h-full
                 flex-row">
                    {/* Menu Bar */}
                    <Sidebar
                      authenticated={authenticated} //Is Privy User Authenticated?
                      linkedWallet={linkedWallet} //Privy External Wallet Connection
                      embeddedWallet={embeddedWallet} //Privy Embedded Wallet Connection
                      connectedWallet={connectedWallet} //Legacy Wallet Connection
                      selected={selected}
                      setSelected={setSelected}
                      jsx={jsx}
                    />
                  </div>

                  <div className=" flex-1 bg-[#090d18] bg-opacity-0 flex-grow flex flex-col map-container overflow-x-hidden mt-[60px] sm:mt-[80px]">
                    {/* Viewport (Route Pages Here) */}
                    {jsx}
                  </div>
                </div>
              </ActiveContext.Provider>
            </ProposalContext.Provider>
          </VoterContext.Provider>
        </BlockchainContext.Provider>
      </PrivyContext.Provider>
    </>
  );
};

export default home;
