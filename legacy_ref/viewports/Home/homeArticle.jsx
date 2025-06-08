import React from "react";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";

//Import Components
import Widget from "../../components/newsWidget";
import Chart from "../../components/tradingChart";

const homeArticle = ({ setSelected, newsObject }) => {
  return (
    <div className="bg-[#00101a] bg-opacity-80 overflow-y-auto overflow-x-hidden h-full rounded-2xl rounded-b-none rounded-r-none py-8 px-3 md:px-4 ">
      <h1
        onClick={() => {
          setSelected("Home");
        }}
        className="text-lg ml-0  md:ml-4 2xl:ml-8 font-semibold cursor-pointer select-none tracking-wide">
        {"< Back to Dashboard"}
      </h1>

      <div className="mx-[0%] mt-[-14px] lg:mt-12 mb-[75px] bg-opacity-0 bg-[#1d1f31] py-[50px] px-2 lg:px-14 rounded-xl lg:bg-opacity-0 md:mx-[5%] xl:mx-[7%] 2xl:mx-[14%]">
        <h1 className="text-3xl font-semibold tracking-wider">{newsObject.headline}</h1>
        <p className="mt-2 text-lg tracking-normal text-slate-300">{newsObject.date}</p>
        <Widget newsObject={newsObject} />
        <p className="mt-12 mb-8 leading-relaxed text-lg tracking-wide text-slate-300 px-[1%]">{newsObject.article_text}</p>
      </div>
    </div>
  );
};

export default homeArticle;
