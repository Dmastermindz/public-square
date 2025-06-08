import React from "react";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

//Import Components
import Widget from "../components/swapWidget";
import Chart from "../components/tradingChart";
import Trading from "../components/tradingViewWidget";
import Logo from "../components/logo";

const swap = () => {
  return (
    // <div className="bg-[#090d18] full-height overflow-y-hidden map-container  rounded-b-none border-[#363a45] border-t-[2px] border-b-[3px]">
    //   <Trading />
    // </div>

    <div className="flex overflow-y-clip map-container full-height bg-[#090d18] flex-col lg:flex-row map-container">
      <div className="grow shrink-0 h-2/3 lg:h-full">
        <Trading />
      </div>
      {/* <div className="flex relative bg-[#090d18] flex-col overflow-hidden shrink-0">
        <iframe
          className="shrink-0 hidden xl:grid"
          src="https://app.bogged.finance/bsc/swap?&embed=1&tokenIn=BNB&tokenOut=0x6500197A2488610ACA288fd8E2DFE88Ec99E596c&theme=dark"
          frameborder="0"
          height="780px"
          width="450px"></iframe>
        <div className="bg-[#1e2735] top-0 left-0 absolute w-[400px] h-[60px]  text-2xl opacity-100"></div>
        <div className="bg-[#1e2735] h-full"></div>
      </div> */}

      {/* <div className="bg-[#1e2735] w-[440px] h-[70px] fixed right-2 text-2xl opacity-0 xl:opacity-100"></div> */}
    </div>
  );
};

export default swap;
