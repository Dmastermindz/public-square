import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useParams, useNavigate } from "react-router-dom";
import CallAquariServer from "../api/callAquariServer.js";

const NewThreadOverlay = ({ isOpen, setIsOpen }) => {
  const { user } = usePrivy();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [quote, setQuote] = useState("");
  console.log("Privy User ID:", user?.id?.slice(10));

  //API Call to backend to Create a new Topic
  const addThread = async () => {
    try {
      const response = await CallAquariServer.post("/topics", {
        forum_id: parseInt(categoryId),
        user_id: user?.id?.slice(10) || "unknown",
        title: title,
      });

      const response2 = await CallAquariServer.post("/posts", {
        topic_id: response.data.data.topics.topic_id,
        user_id: user?.id?.slice(10) || "unknown",
        content: body,
      });

      if (response.data.status === "success") {
        console.log("Server Response (topics):", response);
      }

      if (response.data.status === "success") {
        console.log("Server Response (posts):", response2);
      }
      // Reset form fields
      setTitle("");
      setBody("");
      setIsOpen(false);
      // Refresh the page to show the new thread
      window.location.reload();
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addThread();
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
        <div className="bg-[#1d1f31] shadowzx w-[800px] h-[100svh] lg:h-[90svh] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Start a New Thread</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-text-primary mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-accent-purple bg-opacity-20 text-text-primary border border-accent-purple border-opacity-30 focus:border-accent-purple focus:outline-none"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="body"
                className="block text-text-primary mb-2">
                Body
              </label>
              <textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-accent-purple bg-opacity-20 text-text-primary border border-accent-purple border-opacity-30 focus:border-accent-purple focus:outline-none"
                rows="18"
                required></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 mr-2 rounded-md bg-accent-purple bg-opacity-20 hover:bg-accent-purple bg-opacity-30 text-text-primary transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-accent-purple hover:bg-accent-purple/80 text-white transition-colors">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default NewThreadOverlay;
