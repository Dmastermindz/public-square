import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../../apis/callAquariServer";
import ForumThread from "../../components/forumThread";
import NewThreadOverlay from "../../components/newThreadOverlay";
import { BlockchainContext } from "../../pages/home";

const ThreadList = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { setSelected, activeCategoryId } = useContext(BlockchainContext);
  const [forumTopics, setForumTopics] = useState([]);
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const responseTopics = await CallAquariServer.get("/topics");
        console.log("Full API Response for Topics:", responseTopics);
        if (responseTopics.data && responseTopics.data.data && responseTopics.data.data.topics) {
          const topics = responseTopics.data.data.topics;
          console.log("Topics from API:", topics);

          // Fetch latest dates for all topics
          const latestDates = await Promise.all(
            topics.map((topic) =>
              CallAquariServer.get("/operations/topics-latest-date", {
                params: { topic_id: topic.topic_id },
              })
            )
          );

          // Combine topics with their latest dates
          const topicsWithDates = topics.map((topic, index) => ({
            ...topic,
            latest_date: latestDates[index].data.max,
          }));

          console.log("Topics with latest dates:", topicsWithDates);
          setForumTopics(topicsWithDates);
        } else {
          console.error("Unexpected response structure for topics:", responseTopics);
        }

        const responseForums = await CallAquariServer.get("/forums");
        console.log("Full API Response for Forums:", responseForums);
        if (responseForums.data && responseForums.data.data && responseForums.data.data.forums) {
          const forumsData = responseForums.data.data.forums;
          console.log("Forums from API:", forumsData);
          setForums(forumsData);
        } else {
          console.error("Unexpected response structure for forums:", responseForums);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredTopics = forumTopics.filter((topic) => {
    return topic.forum_id === activeCategoryId;
  });

  // Sort the filtered topics by latest_date
  const sortedTopics = [...filteredTopics].sort((a, b) => {
    const dateA = a.latest_date ? new Date(a.latest_date.replace(" ", "T")) : new Date(0);
    const dateB = b.latest_date ? new Date(b.latest_date.replace(" ", "T")) : new Date(0);
    return dateB - dateA; // Sort in descending order (most recent first)
  });

  const SkeletonThread = () => (
    <div className="flex mb-[2px] mx-[2px] flex-row bg-[#34394d] animate-pulse">
      <div className="flex py-1 flex-grow items-center justify-left bg-[#a8b1ff] text-center px-4 bg-opacity-40 h-16"></div>
      <div className="flex flex-row">
        <div className="flex py-1 items-center justify-center bg-[#a8b1ff] text-center px-2 md:px-4 bg-opacity-40 w-[130px] md:w-[128px] lg:w-[0px]"></div>
        <div className="flex py-1 items-center justify-center bg-[#a8b1ff] text-center px-2 md:px-4 bg-opacity-40 w-[0px] lg:w-[125px]"></div>
        <div className="flex py-1 items-center justify-center bg-[#a8b1ff] text-center px-1 md:px-4 bg-opacity-40 w-[30px] lg:w-full"></div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#000000] bg-opacity-[74%] p-4 md:px-12 md:py-7 min-h-full overflow-y-scroll">
      <NewThreadOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <h1
        onClick={() => setSelected("Forum")}
        className="text-base font-semibold cursor-pointer select-none tracking-wide">
        {"< Back to Categories"}
      </h1>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-300 hover:bg-gray-400 transition-all ease-in-out duration-200 flex items-center justify-center text-black font-semibold text-md mt-4 w-[130px] h-[37px] p-[9px] rounded-md cursor-pointer">
        New Thread
      </button>
      <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full min-h-full">
        <div className="flex flex-col w-full rounded-xl">
          <div className="flex flex-row rounded-xl ">
            <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center text-sm lg:text-base px-4 bg-opacity-40 h-[40px]">Thread</div>
            <div className="flex flex-row">
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-xs lg:text-sm px-4 bg-opacity-40 h-[40px] w-[130px] md:w-[128px] lg:w-[0px]">Replies</div>
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-xs lg:text-sm px-4 bg-opacity-40 h-[40px] w-[0px] lg:w-[125px] lg:pl-0 lg:pr-0">Views</div>
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-xs lg:text-sm px-4 bg-opacity-40 h-[40px] lg:whitespace-nowrap w-[30px] lg:w-full lg:pr-10">Last Post</div>
            </div>
          </div>
          {isLoading ? (
            <>
              <SkeletonThread />
              <SkeletonThread />
              <SkeletonThread />
            </>
          ) : (
            sortedTopics.map((topic) => (
              <ForumThread
                key={topic.topic_id}
                setSelected={setSelected}
                topic={topic}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ThreadList;
