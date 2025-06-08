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
import { Pie } from "../components/pie";
import { Bars } from "../components/bars";
import { App } from "../components/lineChart";

const daoFinancials = () => {
  return (
    <div className="bg-[#000000] bg-opacity-40 min-h-screen max-h-screen rounded-2xl overflow-y-auto overflow-x-hidden rounded-b-none rounded-r-none p-8">
      <div className="flex flex-col lg:flex-row gap-x-8 h-full">
        <div className="w-[300px] sm:w-[425px] sm:h-[300px]">
          <Pie />
        </div>
        <div className="w-[300px] sm:w-[425px] sm:h-[300px]">
          <App />
        </div>
        <div className="w-[300px] sm:w-[425px] sm:h-[300px]">
          <Bars />
        </div>
      </div>
    </div>
  );
};

export default daoFinancials;
