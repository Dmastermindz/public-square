import React from "react";
import Map from "../components/Map";

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

const cleanupMap = () => {
  return (
    <div className="bg-[#090d18] h-full w-full overflow-y-hidden rounded-2xl rounded-b-none rounded-r-none">
      <Map />
      {/* <div className="flex flex-row gap-x-8"></div> Put Map Component Back in Here to Test Zoom and Drag Recenter (Original Codebase) */}

      <div className="flex flex-row absolute bottom-0 right-0 gap-3 p-5 border-[#4e5467] map-hide-on-height hide-on-width">
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

        <div className="absolute hidden xl:block right-[15px] bottom-[75px] w-[400px] h-[800px] bg-[#232734] opacity-[95%] rounded-xl text-center pt-[380px] map-hide-on-height">Cleanups Coming Soon</div>
      </div>
    </div>
  );
};

export default cleanupMap;
