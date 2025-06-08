import React, { useContext, useEffect, useState } from "react";
import { GrDocumentText } from "react-icons/gr";
import { BlockchainContext } from "../App.jsx";
import CallAquariServer from "../api/callAquariServer.js";

const ForumThread = ({ setSelected, topic }) => {
  const { activeTopicId, setActiveTopicId, setActiveTopicTitle } = useContext(BlockchainContext);
  const [postCount, setPostCount] = useState(null);
  const [viewCount, setViewCount] = useState(null);
  const [latestDate, setLatestDate] = useState(null);

  function formatForumDate(dateString) {
    if (!dateString) return "No Posts";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "N/A"
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  function formatForumTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? ""
      : date.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data for topic_id:", topic.topic_id);
        const [postCountResponse, viewCountResponse, latestDateResponse] = await Promise.all([
          CallAquariServer.get("/operations/count-forum-posts", {
            params: { topic_id: topic.topic_id },
          }),
          CallAquariServer.get("/operations/get-views", {
            params: { topic_id: topic.topic_id },
          }),
          CallAquariServer.get("/operations/topics-latest-date", {
            params: { topic_id: topic.topic_id },
          }),
        ]);

        console.log("Post count API response:", postCountResponse);
        console.log("View count API response:", viewCountResponse);
        console.log("Latest date API response:", latestDateResponse);

        setPostCount(postCountResponse.data);
        setViewCount(viewCountResponse.data.views);
        setLatestDate(latestDateResponse.data.max);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Error status:", error.response.status);
        }
        setPostCount(-1);
        setViewCount(-1);
        setLatestDate(null);
      }
    };

    if (topic.topic_id) {
      fetchData();
    }
  }, [topic.topic_id]);

  const incrementViewCount = async (activeTopic) => {
    try {
      const response = await CallAquariServer.get("/operations/increment-views", {
        params: { topic_id: activeTopic },
      });
      console.log(`Increment API Response: ${activeTopic}`, response);
      setViewCount(response.data.views);
    } catch (err) {
      console.error("Error Incrementing Views:", err);
    }
  };

  return (
    <div>
      <div
        onClick={() => {
          setActiveTopicTitle(topic.title);
          setActiveTopicId(topic.topic_id);
          setTimeout(() => {
            incrementViewCount(topic.topic_id);
            setSelected("Thread Page");
          }, 30);
        }}
        className="flex mb-[2px] mx-[2px] flex-row hover:bg-[#34394d] transition duration-300 ease-in-out cursor-pointer">
        <div className="flex py-1 flex-grow items-center justify-left bg-accent-purple text-center px-4 bg-opacity-40">
          <GrDocumentText
            size={47}
            className="flex flex-shrink-0 lg:flex opacity-[95%] h-[44px] pr-4 text-text-primary"
          />
          <div className="flex flex-col my-1">
            <h1 className="text-left text-sm lg:text-md font-light text-text-primary">{topic.title || "Cleanup Helpers"}</h1>
            <div className="flex pt-3 sm:pt-2 md:pt-2 items-center justify-left text-center bg-opacity-40 w-full lg:pr-7 text-xs lg:text-md pr-[0px] text-text-secondary">Started By User: {topic.user_id ? topic.user_id.slice(17) : "Unknown User"}</div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex py-1 items-center justify-center bg-accent-purple text-center px-2 md:px-4 bg-opacity-40 w-full lg:pr-7 text-xs lg:text-base pr-[30px] text-text-primary">{postCount !== null ? postCount : "Loading..."}</div>
          <div className="flex py-1 items-center justify-center bg-accent-purple text-center px-2 md:px-4 bg-opacity-40 w-full text-xs lg:text-base pr-[40px] text-text-primary">{viewCount !== null ? viewCount : "Loading..."}</div>
          <div className="flex flex-col py-1 rounded-t-none items-center justify-center bg-accent-purple text-center px-1 md:px-4 bg-opacity-40 lg:whitespace-nowrap w-full text-xs lg:text-base text-text-primary">
            <p className="text-sm">{formatForumDate(latestDate)}</p>
            <p className="text-xs">{formatForumTime(latestDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumThread;
