import React, { useContext } from "react";
import { GrDocumentText } from "react-icons/gr";
import { BlockchainContext } from "../App.jsx";

const ForumPost = ({ post, setIsOpen }) => {
  const { setActivePostId } = useContext(BlockchainContext);

  return (
    <div className="flex flex-row border-t-[#161f30] border-opacity-50 border-t-[0px] mb-[5px] mx-[2px] bg-accent-purple bg-opacity-40">
      <div className="flex items-start justify-center p-4 md:p-2">
        <div className="flex-shrink-0 sm:mx-7">
          <img
            className="rounded-2xl mt-7 md:mt-2 lg:mt-4 xl:mt-2 flex w-20 md:w-24"
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${post.user_id}`}
            alt="User Avatar"
          />
          <div className="flex pt-2 items-center justify-center text-center bg-opacity-40 w-full text-xs lg:text-md text-text-secondary">{"ID:" + " ..." + post.user_id.slice(17)}</div>
        </div>
      </div>

      <div className="flex flex-col p-4 border-l-[3px] border-[#1d1f31] w-full">
        <h1 className="text-left text-xs font-light text-text-secondary">Posted: {new Date(post.creation_date).toLocaleString()}</h1>

        <div className="mt-2 text-left text-sm md:text-md font-light tracking-normal text-text-primary">
          <p>{post.content}</p>
          <button
            onClick={() => {
              setActivePostId(post);
              setIsOpen(true);
            }}
            className="bg-gray-300 hover:bg-gray-400 transition-all ease-in-out duration-200 text-black font-semibold text-md mt-4 lg:w-[110px] w-[55px] h-[31px] lg:h-[37px] p-[9px] rounded-md cursor-pointer">
            Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForumPost;
