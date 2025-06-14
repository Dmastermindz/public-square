import React from "react";

export const AIPluginCard = ({ title, iconSrc, onClick }) => {
  return (
    <div className="justify-center border-[color:var(--Yammy,#ABABF9)] bg-[rgba(255,255,255,0.11)] flex min-h-[100px] w-full max-w-full flex-col text-2xl font-[510] mb-4 p-4 rounded-2xl border-2 border-solid">
      <button
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        onClick={onClick}>
        <img
          src={iconSrc}
          className="aspect-[1] object-contain w-[68px] self-stretch shrink-0 my-auto"
          alt={`${title} icon`}
        />
        <span className="self-stretch my-auto">{title}</span>
      </button>
    </div>
  );
};
