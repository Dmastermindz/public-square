import React from "react";
import Cleanup from "../assets/pep.jpg";

const newsWidget = ({ newsObject }) => {
  return (
    <div className=" h-[250px] md:h-[500px] shadowz mt-10 w-full bg-[#a9adc4] rounded-lg flex-shrink-0">
      <img
        className="w-full brightness-[86%] h-full object-cover rounded-lg  "
        src={newsObject.image}
      />
    </div>
  );
};

export default newsWidget;
