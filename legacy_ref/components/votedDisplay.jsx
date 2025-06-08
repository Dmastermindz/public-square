import React from "react";
import Profile from "../assets/favicon.png";
import { useContext } from "react";
import { VoterContext } from "../pages/home";
import { ActiveContext } from "../pages/home";

const votedDisplay = ({ index }) => {
  const { activePage } = useContext(ActiveContext);
  const { getVotesOfFunc } = useContext(VoterContext);
  console.log("ALMOST DONE", index);
  return (
    <div className="flex bg-opacity-50 flex-row h-[100px] bg-[#1d1f31] rounded-2xl">
      {/* <img src={Profile} className="h-[40px] mx-[45px] mt-[28px]" /> */}
      <h1 className="flex flex-row min-h-[100px] ml-[25px] 2xl:mt-[2px] 2xl:ml-[320px] text-center items-center tracking-wider text-md md:text-2xl font-thin select-none ">{`${getVotesOfFunc[index][0].slice(0, 18)}`}</h1>
      <h1 className="flex flex-row min-h-[100px] 2xl:mt-[2px] ml-[50px] sm:ml-[65px] md:ml-[80px] lg:ml-[225px] xl:ml-[525px] 2xl:ml-[650px] items-center tracking-wider text-2xl lg:text-3xl font-bold text-white select-none justify-center">{`${getVotesOfFunc[index][2] == true ? "Yes" : " No"}`}</h1>
    </div>
  );
};

export default votedDisplay;
