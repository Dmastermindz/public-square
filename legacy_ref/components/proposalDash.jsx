import React from "react";
import { ActiveContext } from "../pages/home";
import { useContext } from "react";
import Nav from "../components/navbar";

//Import Icons
import { BiSolidWallet } from "react-icons/bi";

const big = 2;

const proposalDash = ({ startVote, getProposalFunc, getProposalsFunc, getVotesOfFunc, displayError, reason }) => {
  const { activePage } = useContext(ActiveContext);
  console.log(JSON.stringify(activePage, null, 2));
  return (
    <div className="flex bg-opacity-50 xl:min-w-[975px] xl:max-w-[975px] xs:min-w-[400px] min-w-[300px]  min-h-[300px] flex-initial flex-col h-full bg-[#1d1f31] rounded-2xl">
      <h1 className="text-2xl pt-7 pl-4 ml-[5px] sm:ml-6 font-semibold tracking-wider">{`${getProposalsFunc[activePage][4]}`}</h1>
      <p className="text-lg ml-1 pl-6 sm:pl-11 pt-3 tracking-wider text-[#4e5467]">{`Proposer: ${getProposalsFunc[activePage][7].slice(0, 18)}`}</p>
      <div className="w-5/6 border border-b-2 border-[#4e5467] mt-6 ml-[20px] sm:ml-[40px]"></div>
      <p className="px-6 py-12 sm:px-12 pt-8 leading-9 tracking-wide">{`${getProposalsFunc[activePage][5]}`}</p>
      <div className="flex flex-row gap-8 p-12 mt-[-60px]">
        <button
          onClick={async () => {
            console.log("Yes Vote Clicked");
            await startVote(true);
          }}
          className="flex justify-center items-center text-lg w-[170px] h-[55px] bg-[#00b351] rounded-md text-center tracking-wide hover:bg-[#1f7747] transition duration-200 ease-in-out cursor-pointer">
          <p className="font-semibold md:flex tracking-wider">Yes</p>
        </button>
        <button
          onClick={async () => {
            console.log("No Vote Clicked");
            await startVote(false);
          }}
          className="flex justify-center items-center text-lg w-[170px] h-[55px] bg-[#7a1212] rounded-md text-center tracking-wide hover:bg-[#531616] transition duration-200 ease-in-out cursor-pointer">
          <p className="font-semibold md:flex tracking-wider">No</p>
        </button>
        <p className="text-red-600 tracking-wider">{displayError ? `Transaction Failed: ${reason}` : null} </p>
      </div>
    </div>
  );
};

export default proposalDash;
