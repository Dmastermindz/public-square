import React from "react";

const InviteSection = () => {
  return (
    <div className="flex h-auto px-2.5 py-2.5 justify-center items-center gap-4 border-2 border-purple-500 bg-[#2E2D7A] rounded-[10px] shadow-[0px_1px_10.4px_0px_rgba(46,44,166,0.40)] w-auto flex-grow-0 self-stretch mx-5">
      <div className="text-center flex flex-col gap-[7px] h-auto self-center">
        <span
          className="text-lg font-bold text-white"
          style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          Invite Friends, Earn Rewards
        </span>
        <span
          className="text-xs font-normal text-white"
          style={{ fontFamily: "DM Sans, sans-serif" }}>
          Up To 2,000 Public Squares when users join
        </span>
        <span
          className="text-xs font-normal text-[#FCA4D0]"
          style={{ fontFamily: "DM Sans, sans-serif" }}>
          through your referral link!
        </span>
      </div>
    </div>
  );
};

export default InviteSection;
