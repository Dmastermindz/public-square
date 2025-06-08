import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../apis/callAquariServer";
import { BlockchainContext } from "../pages/home";

const NewPostOverlay = ({ isOpen, setIsOpen }) => {
  const { user, setSelected, activeTopicId, activePostId, setActivePostId } = useContext(BlockchainContext); // Blockchain Context has Blockchain Data but we will keep TopicId there too
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
        console.log("Server Resposne (posts):", response2);
      }
      // Reset form fields
      // setTitle("");
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
        <div className="bg-[#090d18] shadowzx w-[800px] h-[100svh] lg:h-[90svh] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Reply to a Conversation</h2>
          <div className="flex h-1/4 lg:h-1/2 mb-6 w-full py-5 text-[#e1e2e9] overflow-x-scroll bg-[#a8b1ff] bg-opacity-20 rounded-xl">
            <div>
              <h2 className="text-md pl-8 font-light mb-2 text-[#e1e2e9]">
                By: <span className="text-green-500 font-semibold text-md">&nbsp;{activePostId.user_id}</span>
              </h2>
              <p className="ml-[9px] px-8 lg:px-10">{`" ${activePostId.content} "`}</p>
            </div>
          </div>
          <h2 className="text-lg font-semibold mb-4 text-white">Your Reply</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4"></div>
            <div className="mb-4">
              {/* <label
                htmlFor="body"
                className="block text-white mb-2">
                Body
              </label> */}
              <textarea
                id="body"
                style={{ fontSize: "16px" }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-[250px] lg:h-[175px] text-base px-3 py-2 rounded-md bg-[#474c79] bg-opacity-40 text-white"
                rows="2"
                required></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 mr-2 rounded-md bg-gray-500 text-white">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default NewPostOverlay;
