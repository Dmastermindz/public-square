import React from "react";
import { Pie } from "../components/pie";

const proposalChart = (props) => {
  return (
    <div className="flex bg-opacity-50 flex-1 h-[650px] justify-center  bg-[#1d1f31] rounded-2xl">
      <div className="w-[450px] px-2">
        <h1 className="text-4xl md:ml-[90px] lg:ml-[90px] ml-[80px] mt-8 tracking-wider">Voter Summary</h1>
        <div className="py-12">
          <Pie />
        </div>
      </div>
    </div>
  );
};

export default proposalChart;
