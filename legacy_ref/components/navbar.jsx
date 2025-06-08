import React from "react";
import { useState, useEffect } from "react";
import { useWeb3Modal, useDisconnect } from "@web3modal/ethers5/react";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react";
import { ethers } from "ethers";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import { BiSolidWallet } from "react-icons/bi";
import { MdClose } from "react-icons/md";

//Import Components
import Logo from "./logo.jsx";
import { FiZoomOut } from "react-icons/fi";
import { ActiveContext } from "../pages/home.jsx";
import Home from "../pages/home.jsx";
import SignIn from "../viewports/Home/signIn.jsx";

import { VoterContext } from "../pages/home.jsx";
import { useContext } from "react";

// -------------Connect MetaMask & Get Wallet Balance ------------//
//ANY EVM-BLOCKCHAIN

export let provider;
export let signer;
export let addresz;

//Configure Web3Modal
// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "a7b50ca2e018b2e26a06f4c604d969f8";

// 2. Set chains
const mainnet = {
  chainId: 56,
  name: "BNB Chain",
  currency: "BNB",
  explorerUrl: "https://bscscan.com/",
  rpcUrl: "https://bsc-dataseed1.binance.org/",
};

// 3. Create modal
const metadata = {
  name: "Aquari",
  description: "Clean the World for Profit",
  url: "https://aquari.org",
  icons: ["https://avatars.mywebsite.com/"],
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet],
  projectId,
});

const { open } = useWeb3Modal();

const handleConnectWallet = async () => {};

//Function to Check if Metamask is Initialized
const isMetaMaskInstalled = () => {
  console.log("Checking if Metamask is Installed");
  return typeof window.ethereum !== "undefined" && window.ethereum.isMetaMask === true;
};
provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");

if (isMetaMaskInstalled()) {
  console.log("Metamask is Installed Trying to Get Metamask Provider");
  // provider = new ethers.providers.Web3Provider(window.ethereum);
  provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");

  console.log("Congratulations you Have Metamask, Metamask is your RPC Provider");
} else {
  provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");
}
// else {
//   provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");
//   console.log(
//     "You Need to Install Metamask for Full Functionality, Using Fallback Provider"
//   );
// }

async function connectMetamask() {
  //Metamask requires requesting permission to connect users accounts
  // await provider.send("eth_requestAccounts", []);

  // signer = await provider.getSigner();

  if (isMetaMaskInstalled()) {
    addresz = await signer.getAddress();

    console.log("Metamask Account Address:", addresz);
  } else {
    // const { address, chainId, isConnected } = useWeb3ModalAccount();
    // console.log("Web3Modeal Account Address:", address);
  }
}

// ------------- Reading Data From A Smart Contract ------------//
//BNB CHAIN
const AquariAddress = "0x061ee0Fa1a83c7c36DAdf3CD11fED07E530009a1";

const usdtAbi = [
  {
    inputs: [{ internalType: "address", name: "_aquariToken", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "neededRole", type: "bytes32" },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  { inputs: [], name: "ReentrancyGuardReentrantCall", type: "error" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "Action",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "aquariToken",
    outputs: [{ internalType: "contract IERC20", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "title", type: "string" },
      { internalType: "string", name: "description", type: "string" },
    ],
    name: "createProposal",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "duration", type: "uint256" },
          { internalType: "uint256", name: "upvotes", type: "uint256" },
          { internalType: "uint256", name: "downvotes", type: "uint256" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "bool", name: "passed", type: "bool" },
          { internalType: "address", name: "proposer", type: "address" },
        ],
        internalType: "struct AquariGovernance.ProposalStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "getProposal",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "duration", type: "uint256" },
          { internalType: "uint256", name: "upvotes", type: "uint256" },
          { internalType: "uint256", name: "downvotes", type: "uint256" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "bool", name: "passed", type: "bool" },
          { internalType: "address", name: "proposer", type: "address" },
        ],
        internalType: "struct AquariGovernance.ProposalStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getProposals",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "duration", type: "uint256" },
          { internalType: "uint256", name: "upvotes", type: "uint256" },
          { internalType: "uint256", name: "downvotes", type: "uint256" },
          { internalType: "string", name: "title", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "bool", name: "passed", type: "bool" },
          { internalType: "address", name: "proposer", type: "address" },
        ],
        internalType: "struct AquariGovernance.ProposalStruct[]",
        name: "props",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getStakeholderVotes",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "getVotesOf",
    outputs: [
      {
        components: [
          { internalType: "address", name: "voter", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "choosen", type: "bool" },
        ],
        internalType: "struct AquariGovernance.VotedStruct[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "bool", name: "choosen", type: "bool" },
    ],
    name: "performVote",
    outputs: [
      {
        components: [
          { internalType: "address", name: "voter", type: "address" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "bool", name: "choosen", type: "bool" },
        ],
        internalType: "struct AquariGovernance.VotedStruct",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      {
        internalType: "address",
        name: "callerConfirmation",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
];

const getUsdtInfo = (setGetProposalsFunc, setGetProposalFunc, getProposalsFunc, setGetVotesOfFunc) => {
  useEffect(() => {
    async function doStuff() {
      const usdtContract = new ethers.Contract(AquariAddress, usdtAbi, provider);

      const x = await usdtContract.getProposal(2);
      const y = await usdtContract.getProposals();
      const z = await usdtContract.getVotesOf(2);

      //Push Blockchain Data to State
      setGetProposalFunc(x);
      setGetProposalsFunc(y);
      setGetVotesOfFunc(z);

      console.log("getProposalsFunc:", getProposalsFunc);

      //Test to see if we can pull data from BSC
      console.log(x);
      console.log(y);
      console.log(z);
      console.log(y[0].description);
    }
    doStuff(setGetProposalsFunc, setGetVotesOfFunc, setGetProposalFunc, getProposalsFunc);
  }, [1]);
};

// const readDataFromAquari = async () => {
//   const usdtContract = new ethers.Contract(AquariAddress, usdtAbi, provider);

//   const x = await usdtContract.getProposal(2);
//   const y = await usdtContract.getProposals();
//   const z = await usdtContract.getVotesOf(2);

//   //Test to see if we can pull data from BSC
//   console.log(x);
//   console.log(y);
//   console.log(z);
//   console.log(x.description);
// };

//----------------------------------------------------------------------------

const navbar = ({
  linkedWallet,
  embeddedWallet,
  setNewsObject,
  setJsx,
  setSelected,
  selected,
  ready,
  authenticated, //Privy Authenticated
  login, //Privy Login Function
  logout, //Privy Logout Function
  connectedWallet,
  setConnectedWallet,
  mobileNav,
  setMobileNav,
  getProposalFunc, //Here for Testing
  getProposalsFunc,
  setGetProposalFunc,
  setGetProposalsFunc,
  setGetVotesOfFunc,
}) => {
  const { walletProvider } = useWeb3ModalProvider();
  const isConnected = useWeb3ModalAccount().isConnected;
  if (isConnected) {
    provider = new ethers.providers.Web3Provider(walletProvider);
    signer = provider.getSigner();
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://bscrpc.com");
  }

  const [walletConnected, setWalletConnected] = useState(false);
  const activePage = useContext(ActiveContext);
  console.log(activePage.activePage);

  const startVote = async (param1) => {
    const txResponse = await usdtContract.connect(signer).performVote(activePage.activePage, param1);
    await txResponse.wait();
  };

  const { disconnect } = useDisconnect();

  const address = useWeb3ModalAccount().address;

  console.log("Alternative Way to Address", provider.listAccounts()[0]);

  console.log("Web3 Modal Account:", useWeb3ModalAccount().address);
  useEffect(() => {
    if (isConnected) {
      setWalletConnected(true);
      setConnectedWallet(address);
      console.log("(UseEffect) Web3 Modal Account Address: ", address);
    } else if (connectedWallet == "Disconnected") {
      setWalletConnected(false);
    }
  }, [address]);

  getUsdtInfo(setGetProposalsFunc, setGetProposalFunc, getProposalsFunc, setGetVotesOfFunc);
  // useEffect(() => {
  //   //Push Blockchain Data to State
  //   setGetProposalFunc(x);
  //   setGetProposalsFunc(y);
  //   setGetVotesOfFunc(z);
  // }, [1]);
  return (
    <div className="flex glassmorphism-nav z-[200] sm:pt-[5px] pt-[0px] h-[59px] flex-row w-full bg-[#1d1f31] sm:h-[78px] py-1.5 items-center  shadow-md shadow-[#141627] transition duration-200">
      <Logo />
      {/* <div className="hidden absolute right-[250px] ml-[600px] md:flex flex-row gap-4 cursor-pointer select-none ">
        <div
          onClick={async () => {
            await startVote(true);
          }}
          className="flex rounded-lg w-[125px] h-[30px] bg-green-500 hover:bg-[#208040] transition duration-200 font-bold justify-center items-center tracking-wider"
        >
          Yes Vote
        </div>
        <div
          onClick={async () => {
            await startVote(false);
          }}
          className="flex rounded-lg w-[125px] h-[30px] bg-red-600 hover:bg-[#7a2020] transition duration-200 font-bold justify-center items-center tracking-wider"
        >
          No Vote
        </div>
      </div> */}

      <div className="mb-[35px]">
        <div className={authenticated ? "absolute right-[95px] md:right-[35px] w-[45px] md:w-[170px] h-[40px] bg-[#00b351] rounded-md text-center hover:bg-[#207445] transition duration-200 ease-in-out cursor-pointer" : "absolute right-[40px] md:right-[35px] w-[45px] md:w-[170px] h-[40px] bg-[#858a87] rounded-md text-center hover:bg-[#505552] transition duration-200 ease-in-out cursor-pointer"}>
          <button
            className="flex flex-row gap-3 items-center ml-3 mt-2 select-none"
            onClick={
              !authenticated
                ? () => {
                    login();
                  }
                : () => {
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
                    logout();
                  }
            }>
            <BiSolidWallet size={22} />
            {!authenticated ? <p className="hidden font-semibold md:flex">Connect Wallet</p> : <p className="hidden font-semibold text-sm md:flex">Wallet Connected</p>}
          </button>
        </div>

        {/* <div className={walletConnected ? "absolute right-[95px] md:right-[35px] w-[45px] md:w-[170px] h-[40px] bg-[#00b351] rounded-md text-center hover:bg-[#207445] transition duration-200 ease-in-out cursor-pointer" : "absolute right-[95px] md:right-[35px] w-[45px] md:w-[170px] h-[40px] bg-[#858a87] rounded-md text-center hover:bg-[#505552] transition duration-200 ease-in-out cursor-pointer"}>
          <button
            onClick={async () => {
              if (isMetaMaskInstalled() && !isConnected) {
                // await connectMetamask();
                await open();
                setConnectedWallet(addresz);
                setWalletConnected(true);
                console.log(addresz);
              } else if (isConnected) {
                disconnect();
                setWalletConnected(false);
                setConnectedWallet("Disconnected");
              } else {
                await open().then(
                  setTimeout(async () => {
                    provider = new ethers.providers.Web3Provider(walletProvider);
                    signer = await provider.getSigner();
                    console.log(address);
                  }, 1000)
                );
              }
            }}
            className="flex flex-row gap-3 items-center ml-3 mt-2 select-none">
            <BiSolidWallet size={22} />
            {!walletConnected ? <p className="hidden font-semibold md:flex">Connect Wallet</p> : <p className="hidden font-semibold text-sm md:flex">Wallet Connected</p>}
          </button>
        </div> */}
        {/* <BsInstagram className="cursor-pointer" size="24" color="white" />
        <BsFacebook className="cursor-pointer" size="24" color="white" />
        <BsLinkedin className="cursor-pointer" size="24" color="white" />
        <BsYoutube className="cursor-pointer" size="30" color="white" /> */}
      </div>
      {!mobileNav ? (
        <HiMenu
          onClick={() => {
            mobileNav ? setMobileNav(false) : setMobileNav(true);
          }}
          className={authenticated ? "flex mt-[6px] absolute right-[40px] cursor-pointer md:hidden transition duration-100 ease-in-out" : "hidden"}
          size="35"
        />
      ) : (
        <MdClose
          onClick={() => {
            mobileNav ? setMobileNav(false) : setMobileNav(true);
          }}
          className={authenticated ? "flex mt-[6px] absolute right-[40px] cursor-pointer md:hidden transition duration-100 ease-in-out" : "hidden"}
          size="38"
        />
      )}
    </div>
  );
};

provider = navbar.provider;

export default navbar;
