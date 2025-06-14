import React, { useEffect, useState } from "react";
import Insignia from "../assets/AquariProfileLogo.png";
import Eye from "../assets/eye.png";
import CallAquariServer from "../api/callAquariServer.js";

const ForumCategory = ({ navigate, forumCategories, forumForums }) => {
  const [threadCounts, setThreadCounts] = useState({});
  const [postCounts, setPostCounts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [latestDateData, setLatestDateData] = useState({});

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
    const fetchCounts = async () => {
      setIsLoading(true);
      const threadCountsData = {};
      const postCountsData = {};
      const latestDateDataTemp = {};

      const fetchPromises = forumForums.map(async (forum) => {
        try {
          const [threadCountResponse, postCountResponse, latestDateResponse] = await Promise.all([
            CallAquariServer.get(`/operations/count-threads?forum_id=${forum.forum_id}`),
            CallAquariServer.get("/operations/count-all-posts", {
              params: { forum_id: forum.forum_id },
            }),
            CallAquariServer.get("/operations/forum-latest-date", {
              params: { forum_id: forum.forum_id },
            }),
          ]);

          threadCountsData[forum.forum_id] = threadCountResponse.data;
          postCountsData[forum.forum_id] = postCountResponse.data;
          latestDateDataTemp[forum.forum_id] = latestDateResponse.data.max;

          console.log(`Forum ${forum.forum_id} latest date:`, latestDateResponse.data);
        } catch (err) {
          console.error(`Error fetching data for forum ${forum.forum_id}:`, err);
          threadCountsData[forum.forum_id] = 0;
          postCountsData[forum.forum_id] = 0;
          latestDateDataTemp[forum.forum_id] = null;
        }
      });

      await Promise.all(fetchPromises);

      console.log("Thread counts:", threadCountsData);
      console.log("Post counts:", postCountsData);
      console.log("Latest date data:", latestDateDataTemp);

      setThreadCounts(threadCountsData);
      setPostCounts(postCountsData);
      setLatestDateData(latestDateDataTemp);
      console.log("LatestDateData", latestDateData);
      setIsLoading(false);
    };

    if (forumForums.length > 0) {
      fetchCounts();
    } else {
      setIsLoading(false);
    }
  }, [forumForums]);

  return (
    <div>
      {forumCategories.map((category) => (
        <React.Fragment key={category.category_id}>
          <div className="flex pl-8 py-2 mt-[2px] mx-[2px] items-center tracking-wide font-medium bg-gradient-to-r from-[#264EA4] via-[#4158ED] via-[#297FE8] via-[#2246BC] to-[#181862] text-text-primary">{category.name || "Category is Undefined"}</div>
          {forumForums
            .filter((forum) => forum.category_id === category.category_id)
            .map((forum) => (
              <div
                key={forum.forum_id}
                className="flex flex-row hover:bg-[#34394d] transition duration-300 ease-in-out cursor-pointer border border-[#6B7280]">
                <div
                  onClick={() => {
                    navigate(`/category/${forum.forum_id}`);
                  }}
                  className="flex py-1 flex-grow items-center justify-left bg-[#111827] text-center px-4">
                  <img
                    className="rounded-full hidden sm:flex opacity-[95%] h-[44px] pr-4"
                    src={Eye}
                    alt="Eye"
                  />
                  <div className="flex flex-col my-1">
                    <h1 className="text-left font-light text-white">{forum.name || "Forum is Undefined"}</h1>
                    <p className="text-left max-w-[600px] text-xs font-light text-white/80">{forum.description || "Description is Undefined"}</p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex py-1 items-center justify-center bg-[#111827] text-center px-4 w-full lg:pr-7 text-white">
                    {(() => {
                      const isNFT = Math.random() > 0.5;
                      return <span className={`px-3 py-1 rounded-full text-xs font-medium ${isNFT ? "bg-red-600" : "bg-green-600"}`}>{isNFT ? "NFT Required" : "Public"}</span>;
                    })()}
                  </div>
                </div>
              </div>
            ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ForumCategory;
