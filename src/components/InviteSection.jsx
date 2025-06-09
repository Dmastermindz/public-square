import React from "react";

const InviteSection = () => {
  return (
    <section className="flex flex-col self-stretch relative shadow-[0px_1px_10.4px_0px_rgba(46,44,166,0.40)] overflow-hidden min-h-[63px] w-full gap-4 text-2xl text-white font-bold text-center leading-8 mt-4 px-2.5 py-1.5 max-md:max-w-full">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/6f2aebc9bb734d979c603aa774a20c1a/82177c3efb2083cca85300f16399e68c167665da?placeholderIfAbsent=true"
        className="absolute h-full w-full object-cover inset-0"
        alt="Invite friends background"
      />
      <div className="relative">
        <h3 className="text-lg font-bold mb-2">Invite Friends, Earn Rewards</h3>
        <p className="font-normal text-xs leading-6">
          Up To 2,000 Public Squares when users join <span className="text-[rgba(252,164,208,1)]">through your referral link!</span>
        </p>
      </div>
    </section>
  );
};

export default InviteSection;
