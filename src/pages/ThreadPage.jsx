import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../api/callAquariServer.js";
import ForumPost from "../components/ForumPost.jsx";
import NewPostOverlay from "../components/NewPostOverlay.jsx";
import { BlockchainContext } from "../App.jsx";

const ThreadPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelected, activeTopicId } = useContext(BlockchainContext);
  const [forumPosts, setForumPosts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CallAquariServer.get("/posts");
        console.log("Full API Response for Posts:", response);
        if (response.data && response.data.data && response.data.data.posts) {
          const posts = response.data.data.posts;
          console.log("Posts from API:", posts);
          setForumPosts(posts);
        } else {
          console.error("Unexpected response structure for posts:", response);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    }
    fetchData();
  }, []);

  const filteredPosts = forumPosts.filter((post) => {
    return post.topic_id === activeTopicId;
  });

  return (
    <div className="bg-black bg-opacity-[74%] p-4 md:px-12 md:py-7 min-h-full overflow-y-scroll">
      <NewPostOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <h1
        onClick={() => setSelected("Thread List")}
        className="text-base font-semibold cursor-pointer select-none tracking-wide text-text-primary hover:text-accent-purple transition-colors">
        {"< Back to Thread List"}
      </h1>

      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-300 hover:bg-gray-400 transition-all ease-in-out duration-200 flex items-center justify-center text-black font-semibold text-md mt-4 w-[130px] h-[37px] p-[9px] rounded-md cursor-pointer">
        New Post
      </button>

      <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full min-h-full">
        <div className="flex flex-col w-full rounded-xl">
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
  );
};

export default ThreadPage;
