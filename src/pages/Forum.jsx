import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import CallAquariServer from "../api/callAquariServer.js";
import ForumCategory from "../components/ForumCategory.jsx";
import Announcement from "../components/AnnouncementBanner.jsx";
import InviteSection from "../components/InviteSection.jsx";
import { ArrowUpDown } from "lucide-react";

const Forum = () => {
  const navigate = useNavigate();
  const [forumCategories, setForumCategories] = useState([]);
  const [forumForums, setForumForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const fetchWithRetry = async (endpoint, setter) => {
      const maxRetries = 3;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const response = await CallAquariServer.get(endpoint);
          if (response.data?.data?.[endpoint.slice(1)]) {
            setter(response.data.data[endpoint.slice(1)]);
            return true;
          } else {
            throw new Error(`Invalid ${endpoint} data structure`);
          }
        } catch (err) {
          console.error(`Error fetching ${endpoint}:`, err);
          retries++;
          if (retries === maxRetries) {
            setError(`Failed to load ${endpoint} data: ${err.message}`);
            return false;
          }
          await new Promise((resolve) => setTimeout(resolve, 2000 * retries));
        }
      }
    };

    const categoriesSuccess = await fetchWithRetry("/categories", setForumCategories);
    const forumsSuccess = await fetchWithRetry("/forums", setForumForums);

    if (categoriesSuccess && forumsSuccess) {
      console.log("Data fetching complete.");
    } else {
      setRetryCount((prev) => prev + 1);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("Forum component mounted or updated. Fetching data...");
    fetchData();
    return () => {
      console.log("Forum component will unmount");
    };
  }, [fetchData, retryCount]);

  const SkeletonCategory = () => (
    <div className="flex mb-[2px] mx-[2px] flex-row bg-[#34394d] animate-pulse">
      <div className="flex py-1 flex-grow items-center justify-left bg-accent-purple text-center px-4 bg-opacity-40 h-16"></div>
      <div className="flex flex-row">
        <div className="flex py-1 items-center justify-center bg-accent-purple text-center px-2 md:px-4 bg-opacity-40 w-[50px] lg:w-[0px]"></div>
        <div className="flex py-1 items-center justify-center bg-accent-purple text-center px-2 md:px-4 bg-opacity-40 w-[50px] lg:w-[125px]"></div>
        <div className="flex py-1 items-center justify-center bg-accent-purple text-center px-1 md:px-4 bg-opacity-40 w-[125px] lg:w-full"></div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <>
          <SkeletonCategory />
          <SkeletonCategory />
          <SkeletonCategory />
        </>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 p-4">
          {error}
          <button
            onClick={() => setRetryCount((prev) => prev + 1)}
            className="ml-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Retry
          </button>
        </div>
      );
    }

    if (forumCategories.length > 0 && forumForums.length > 0) {
      return (
        <ForumCategory
          navigate={navigate}
          forumCategories={forumCategories}
          forumForums={forumForums}
        />
      );
    }

    return <div className="text-yellow-500 p-4">No forum data available. Please try refreshing the page.</div>;
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiIC8+Cjwvc3ZnPgo=')] bg-blend-color-dodge">
      {/* Main Content Container */}
      <div className="flex w-full px-4 md:px-8">
        <div className="flex flex-col w-full gap-4 py-4">
          {/* Header with Breadcrumb and View Toggle */}
          <div className="flex items-center gap-4 w-full">
            <div className="flex items-center gap-2.5 flex-1">
              <h1 className="text-2xl font-semibold leading-6 text-white font-sf-pro">Community Home &gt; Threads</h1>
            </div>

            <button
              className="px-5 py-2 gap-2 border border-[#ABABF9] bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] shadow-[0px_2px_6px_0px_rgba(16,24,40,0.06)] text-[#111] text-base font-medium flex items-center rounded-lg"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Expressive View
              <ArrowUpDown className="w-5 h-5" />
            </button>
          </div>

          {/* Announcement Banner */}
          <Announcement />

          {/* Invite Banner */}
          <InviteSection />

          {/* Forum Headers */}
          <div className="flex justify-between items-start w-full">
            <div
              className="text-base font-medium bg-gradient-to-b from-[#ECECFF] to-[#E1E1FE] bg-clip-text text-transparent"
              style={{ fontFamily: "Inter, sans-serif" }}>
              Threads
            </div>
          </div>

          {/* Forum Content */}
          <div className="flex flex-col w-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Forum;
