import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../api/callAquariServer.js";
import { BlockchainContext } from "../App.jsx";

const NewPostOverlay = ({ isOpen, setIsOpen }) => {
  const { user, setSelected, activeTopicId, activePostId, setActivePostId } = useContext(BlockchainContext);
  const [body, setBody] = useState("");
  const [quote, setQuote] = useState("");

  //API Call to backend to Create a new Post
  const addPost = async () => {
    try {
      const response2 = await CallAquariServer.post("/posts", {
        topic_id: activeTopicId,
        user_id: user.id.slice(10),
        content: body,
      });

      if (response2.data.status === "success") {
        console.log("Server Response (posts):", response2);
      }
      // Reset form fields
      setBody("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    addPost();
    setSelected("Thread List"); // These two lines are a Duct Tape Refresh Page Solution.
    setTimeout(() => {
      setSelected("Thread Page");
    }, 1000);
    console.log("Dialog Window Open?", isOpen);
    console.log("Body:", body);
    // Reset form fields
    setBody("");
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  } // Don't render if the overlay is not open
  else
    return (
      <div className="fixed overflow-y-scroll inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-background-secondary shadowzx w-[800px] h-[100svh] lg:h-[90svh] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Reply to a Conversation</h2>
          <div className="flex h-1/4 lg:h-1/2 mb-6 w-full py-5 text-text-primary overflow-x-scroll bg-accent-purple bg-opacity-20 rounded-xl">
            <div>
              <h2 className="text-md pl-8 font-light mb-2 text-text-primary">
                By: <span className="text-green-500 font-semibold text-md">&nbsp;{activePostId?.user_id}</span>
              </h2>
              <p className="ml-[9px] px-8 lg:px-10">{`" ${activePostId?.content} "`}</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4 text-text-primary">Your Reply</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4"></div>
            <div className="mb-4">
              <textarea
                id="body"
                style={{ fontSize: "16px" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-[250px] lg:h-[175px] text-base px-3 py-2 rounded-md bg-accent-purple bg-opacity-40 text-text-primary border border-accent-purple border-opacity-30 focus:border-accent-purple focus:outline-none"
                rows="2"
                required></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 mr-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default NewPostOverlay;
