import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../apis/callAquariServer";
import { BlockchainContext } from "../pages/home";

const NewThreadOverlay = ({ isOpen, setIsOpen }) => {
  const { user, setSelected, activeCategoryId } = useContext(BlockchainContext); // Blockchain Context has Blockchain Data but we will keep threadID there too
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [quote, setQuote] = useState("");
  console.log("Privy User ID:", user.id.slice(10));

  //API Call to backend to Create a new Topic
  const addThread = async () => {
    try {
      const response = await CallAquariServer.post("/topics", {
        forum_id: activeCategoryId,
        user_id: user.id.slice(10),
        title: title,
      });

      const response2 = await CallAquariServer.post("/posts", {
        topic_id: response.data.data.topics.topic_id,
        user_id: user.id.slice(10),
        content: body,
      });

      if (response.data.status === "success") {
        console.log("Server Resposne (topics):", response);
      }

      if (response.data.status === "success") {
        console.log("Server Resposne (posts):", response2);
      }
      // Reset form fields
      setTitle("");
      setBody("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addThread();
    setSelected("Forum"); // These two lines are a Duct Tape Refresh Page Solution.
    setTimeout(() => {
      setSelected("Thread List");
    }, 1000);
    // Handle form submission, e.g., send data to server
    console.log("Dialog Window Open?", isOpen);
    console.log("Title:", title);
    console.log("Body:", body);
  };

  if (!isOpen) {
    return null;
  } // Don't render if the overlay is not open
  else
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#090d18] shadowzx w-[800px] h-[100svh] lg:h-[90svh] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Start a New Thread</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-white mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#a8b1ff] bg-opacity-20 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="body"
                className="block text-white mb-2">
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#a8b1ff] bg-opacity-20 text-white" //bg-[#474c79]
                rows="18"
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

export default NewThreadOverlay;
