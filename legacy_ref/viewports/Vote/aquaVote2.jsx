import React from "react";
import { ethers } from "ethers";
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers5/react";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { ActiveContext } from "../../pages/home";
import { VoterContext } from "../../pages/home";
import { ProposalContext } from "../../pages/home";
import { BlockchainContext } from "../../pages/home";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

//Import Components
import Widget from "../../components/swapWidget";
import ProposalDash from "../../components/proposalDash";
import ProposalChart from "../../components/proposalChart";
import VotedDisplay from "../../components/votedDisplay";
// import { provider } from "../../components/navbar";
// import { signer } from "../../components/navbar";

let provider;
let signer;

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

//Regular Expression to Extract Reason from ErrorMessage String
function extractReasonFromErrorMessage(errorMessage) {
  const reasonPattern = /reason="(.*?)"/;
  const match = reasonPattern.exec(errorMessage);

  if (match && match[1]) {
    return match[1];
  } else {
    return "Reason not found in the error message.";
  }
}

const aquaVote = (props) => {
  const { activePage } = useContext(ActiveContext);
  const { setGetProposalFunc } = useContext(ProposalContext);
  const { setGetProposalsFunc } = useContext(ProposalContext);
  const { setGetVotesOfFunc } = useContext(VoterContext);
  const { getVotesOfFunc } = useContext(VoterContext);
  const { privySigner, provider, setSelected } = useContext(BlockchainContext);
  const usdtContract = new ethers.Contract(AquariAddress, usdtAbi, provider);

  //React State
  const [displayError, setDisplayError] = useState(false);
  const [reason, setReason] = useState("Error: Transaction Failed, Report to Dev Team");

  const { walletProvider } = useWeb3ModalProvider();
  // provider = new ethers.providers.Web3Provider(walletProvider);

  // signer = async () => await provider.getSigner();
  console.log("Captured Privy Signer", privySigner);

  const startVote = async (param1) => {
    // console.log("Captured Blockchain ProviderX", provider);
    try {
      const txResponse = await usdtContract.connect(privySigner).performVote(activePage, param1);
      await txResponse.wait();
    } catch (error) {
      // Check if the error structure matches the expected format
      if (error.data && error.data.message) {
        // Extract and display the error message
        console.log("Error:", error.data.message);
      } else {
        // Log the entire error if it doesn't match the expected format

        console.log("An unexpected error occurred:", reason);
      }
      setReason(extractReasonFromErrorMessage(error.message));
      setDisplayError(true);
    }
  };

  useEffect(() => {
    async function gatherData(param1) {
      const x = await usdtContract.getProposal(param1);
      const y = await usdtContract.getProposals();
      const z = await usdtContract.getVotesOf(param1);

      console.log(x, y, z, y[0].description);

      setGetVotesOfFunc(z);
    }

    gatherData(activePage);
  }, [activePage, setGetVotesOfFunc]); // Dependencies array

  return (
    <div className="bg-[#000] bg-opacity-40 lg:h-full xl:h-full rounded-2xl rounded-b-none rounded-r-none p-10 overflow-x-hidden">
      <div className="flex flex-col gap-x-8 gap-y-8">
        <h1
          onClick={() => {
            setSelected("AquaVote");
          }}
          className="text-lg font-semibold cursor-pointer select-none tracking-wide">
          {"< Back to Proposal Select"}
        </h1>
        <h1 className="text-3xl font-semibold tracking-wider">{`Aquari Governance Proposal #${activePage}`}</h1>
        <div className="flex flex-col xl:flex-row gap-y-8 xl:gap-x-8">
          <ProposalDash
            reason={reason}
            setReason={setReason}
            displayError={displayError}
            setDisplayError={setDisplayError}
            startVote={startVote}
            getProposalFunc={props.getProposalFunc}
            getProposalsFunc={props.getProposalsFunc}
            getVotesOfFunc={props.getVotesOfFunc}
          />
          <ProposalChart pieVotes={props.pieVotez} />
        </div>
        <h1 className="text-3xl font-semibold mt-16 tracking-wider">Casted Ballots</h1>
        {getVotesOfFunc[0] ? (
          getVotesOfFunc.map((item, index) => {
            return (
              <VotedDisplay
                key={index}
                index={index}
                getVotesOfFunc={props.getVotesOfFunc}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center flex-row h-[100px] bg-[#1d1f31] rounded-2xl">
            <h1 className="text-3xl font-thin tracking-wider">No Votes Found</h1>
          </div>
        )}
      </div>

      {/* Social Media Icons */}
      <div className="flex flex-row absolute bottom-0 right-0 gap-3 p-5 border-[#4e5467] hide-on-height hide-on-width">
        <div className="bg-[#232734] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
          <BsTwitterX
            className="cursor-pointer"
            size="24"
            color="white"
          />
        </div>

        <div className=" bg-[#232734] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
          <BsInstagram
            className="cursor-pointer"
            size="24"
            color="white"
          />
        </div>

        <div className=" bg-[#232734] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
          <BsFacebook
            className="cursor-pointer"
            size="24"
            color="white"
          />
        </div>

        <div className=" bg-[#232734] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
          <BsLinkedin
            className="cursor-pointer"
            size="24"
            color="white"
          />
        </div>

        <div className=" bg-[#232734] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
          <FaTelegramPlane
            className="cursor-pointer"
            size="24"
            color="white"
          />
        </div>
      </div>
    </div>
  );
};

export default aquaVote;
