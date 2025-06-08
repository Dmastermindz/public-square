import React from "react";
import Cleanup from "../assets/pep.jpg";
import { PrivyProvider } from "@privy-io/react-auth";
import { PrivyContext } from "../pages/home";
import { useContext } from "react";

const newsCard = ({ setSelected, item, setNewsObject, selected }) => {
  const { login } = useContext(PrivyContext);
  return (
    <div
      onClick={login}
      className="select-none grow hover:cursor-pointer space-x-0.5 h-[250px] shadowz w-[300px] bg-[#1d1f31] bg-opacity-80 rounded-lg border-[1px] border-[#1d1f31] transition-transform hover:scale-[103%] duration-300">
      <img
        className="w-full brightness-[90%] object-cover h-3/5 rounded-t-lg"
        src={item.image}
      />
      <p className="flex px-[12px] h-2/5 text-md items-center justify-center font-normal  tracking-wider">{item.headline}</p>
    </div>
  );
};

export default newsCard;
