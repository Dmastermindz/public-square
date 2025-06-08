import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../../apis/callAquariServer";
import { BsInstagram, BsLinkedin, BsFacebook, BsYoutube, BsTwitterX } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import ForumPost from "../../components/forumPost";
import NewPostOverlay from "../../components/newPostOverlay";
import { BlockchainContext } from "../../pages/home";

const ThreadPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelected, activeTopicId, activeTopicTitle } = useContext(BlockchainContext);
  const [forumPosts, setForumPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await CallAquariServer.get("/posts");
        if (response.data.status === "success") {
          setForumPosts(response.data.data.posts);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  const filteredPosts = forumPosts.filter((post) => post.topic_id === activeTopicId);

  return (
    <div className="bg-[#000000] bg-opacity-[74%] p-4 md:px-12 md:py-7 h-screen overflow-y-scroll">
      <NewPostOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <h1
        onClick={() => {
          setSelected("Thread List");
        }}
        className="text-base font-semibold cursor-pointer select-none tracking-wide">
        {"< Back to Threads"}
      </h1>

      <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full h-full">
        <div className="flex flex-col w-full rounded-xl">
          <div className="flex flex-row rounded-xl">
            <div className="flex flex-none rounded-t-xl items-center justify-center bg-[#474c79] text-center text-sm lg:text-base px-4 bg-opacity-40 w-[110px] sm:w-[154px] min-h-[40px]">Author</div>
            <div className="flex flex-row w-full">
              <div className="flex rounded-t-xl rounded-l-none items-center justify-center bg-[#474c79] text-center text-xs lg:text-sm px-4 bg-opacity-40 flex-grow min-h-[40px]">{"THREAD: " + activeTopicTitle}</div>
            </div>
          </div>
          <div className="flex-grow">
            {filteredPosts.map((post) => (
              <ForumPost
                key={post.post_id}
                post={post}
                setIsOpen={setIsOpen}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
