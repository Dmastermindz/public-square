import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CallAquariServer from "../api/callAquariServer.js";
import ForumPost from "../components/ForumPost.jsx";
import NewPostOverlay from "../components/NewPostOverlay.jsx";

const ThreadPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { threadId } = useParams();
  const navigate = useNavigate();
  const [forumPosts, setForumPosts] = useState([]);
  const [threadTitle, setThreadTitle] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch posts
        const response = await CallAquariServer.get("/posts");
        console.log("Full API Response for Posts:", response);
        if (response.data && response.data.data && response.data.data.posts) {
          const posts = response.data.data.posts;
          console.log("Posts from API:", posts);
          setForumPosts(posts);
        } else {
          console.error("Unexpected response structure for posts:", response);
        }

        // Fetch thread title
        const topicsResponse = await CallAquariServer.get("/topics");
        if (topicsResponse.data && topicsResponse.data.data && topicsResponse.data.data.topics) {
          const topic = topicsResponse.data.data.topics.find((t) => t.topic_id === parseInt(threadId));
          if (topic) {
            setThreadTitle(topic.title);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [threadId]);

  const filteredPosts = forumPosts.filter((post) => {
    return post.topic_id === parseInt(threadId);
  });

  // Get the forum_id from the first post to navigate back to the correct category
  const forumId = filteredPosts.length > 0 ? filteredPosts[0].forum_id : null;

  const handleReplyClick = (post) => {
    setSelectedPost(post);
  };

  return (
    <div className="bg-black bg-opacity-[74%] p-4 md:px-12 md:py-7">
      <NewPostOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedPost={selectedPost}
      />

      <h1
        onClick={() => (forumId ? navigate(`/category/${forumId}`) : navigate("/"))}
        className="text-base font-semibold cursor-pointer select-none tracking-wide text-text-primary hover:text-accent-purple transition-colors">
        {"< Back to Thread List"}
      </h1>

      {threadTitle && <h2 className="text-xl font-semibold text-text-primary mt-4 mb-2">{threadTitle}</h2>}

      <button
        onClick={() => {
          setSelectedPost(null);
          setIsOpen(true);
        }}
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
              onReplyClick={handleReplyClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
