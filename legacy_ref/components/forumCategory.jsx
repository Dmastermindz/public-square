import React, { useContext, useEffect, useState } from "react";
import Insignia from "../assets/AquariProfileLogo.png";
import { BlockchainContext } from "../pages/home";
import CallAquariServer from "../apis/callAquariServer";

const ForumCategory = ({ setSelected, forumCategories, forumForums }) => {
  const { setActiveCategoryId } = useContext(BlockchainContext);
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
          <div className="flex pl-8 py-2 mt-[2px] mx-[2px] items-center tracking-wide font-medium bg-[#777dc7] bg-opacity-40">{category.name || "Category is Undefined"}</div>
          {forumForums
            .filter((forum) => forum.category_id === category.category_id)
            .map((forum) => (
              <div
                key={forum.forum_id}
                className="flex my-[2px] mx-[2px] flex-row hover:bg-[#34394d] transition duration-300 ease-in-out cursor-pointer">
                <div
                  onClick={() => {
                    setActiveCategoryId(forum.forum_id);
                    setSelected("Thread List");
                  }}
                  className="flex py-1 flex-grow items-center justify-left bg-[#a8b1ff] text-center px-4 bg-opacity-40">
                  <img
                    className="rounded-full hidden sm:flex opacity-[95%] h-[44px] pr-4"
                    src={Insignia}
                    alt="Insignia"
                  />
                  <div className="flex flex-col my-1">
                    <h1 className="text-left font-light">{forum.name || "Forum is Undefined"}</h1>
                    <p className="text-left max-w-[600px] text-xs font-light text-[#e0e0e0]">{forum.description || "Description is Undefined"}</p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex py-1 items-center justify-center bg-[#a8b1ff] text-center px-4 bg-opacity-40 w-full lg:pr-7">{isLoading ? "..." : threadCounts[forum.forum_id] ?? 0}</div>
                  <div className="flex py-1 items-center justify-center bg-[#a8b1ff] text-center px-4 bg-opacity-40 w-full">{isLoading ? "..." : postCounts[forum.forum_id] ?? 0}</div>
                  <div className="flex flex-col py-1 rounded-t-none items-center justify-center bg-[#a8b1ff] text-center px-4 bg-opacity-40 lg:whitespace-nowrap w-full">
                    {isLoading ? (
                      "..."
                    ) : (
                      <>
                        <p className="text-sm">{formatForumDate(latestDateData[forum.forum_id])}</p>
                        <p className="text-xs">{formatForumTime(latestDateData[forum.forum_id])}</p>
                      </>
                    )}
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
