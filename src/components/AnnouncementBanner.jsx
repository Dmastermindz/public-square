import React from "react";

const AnnouncementBanner = () => {
  return (
    <section
      className="flex min-h-[106px] w-full text-2xl text-black font-bold leading-8 justify-between mt-4 max-md:max-w-full"
      aria-labelledby="announcement-title">
      <article className="self-stretch flex-1 shrink basis-[0%] border-[color:var(--Yammy,#ABABF9)] shadow-[0px_1px_10.4px_0px_rgba(46,44,166,0.40)] bg-[linear-gradient(180deg,#ECECFF_0%,#E1E1FE_100%)] min-w-60 min-h-[90px] w-full gap-4 px-4 py-2 rounded-[10px] border-2 border-solid max-md:max-w-full">
        <h2
          id="announcement-title"
          className="text-lg font-bold mb-2">
          Announcement
        </h2>
        <p className="font-normal text-xs leading-6 text-gray-700">Welcome to the Public Square Message Board! If this is your first time visiting the forums, make sure to read the forum rules before posting. Also check out the FAQ. Note that you have to register an account before you are able to post.</p>
      </article>
    </section>
  );
};

export default AnnouncementBanner;
