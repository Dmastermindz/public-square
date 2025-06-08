import React, { useState, useEffect, useCallback, useContext } from "react";
import CallAquariServer from "../api/callAquariServer.js";
import ForumCategory from "../components/ForumCategory.jsx";
import { BlockchainContext } from "../App.jsx";

const Forum = () => {
  const { setSelected, user } = useContext(BlockchainContext);
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

  useEffect(() => {
    const addUser = async () => {
      try {
        console.log("Adding user...");
        await CallAquariServer.post("/users", { user_id: user.id.slice(10) });
        console.log("User added successfully");
      } catch (error) {
        console.error("Error Creating New User:", error);
      }
    };
    if (user && user.id) {
      addUser();
    }
  }, [user]);

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
          setSelected={setSelected}
          forumCategories={forumCategories}
          forumForums={forumForums}
        />
      );
    }

    return <div className="text-yellow-500 p-4">No forum data available. Please try refreshing the page.</div>;
  };

  return (
    <div className="bg-black bg-opacity-[74%] p-4 md:p-12 md:pt-7 min-h-full overflow-y-scroll">
      <h1 className="text-lg lg:text-2xl font-semibold cursor-pointer select-none tracking-wide text-text-primary">Community Home</h1>

      <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full min-h-full">
        <div className="flex flex-col w-full rounded-xl">
          <div className="flex flex-row rounded-xl">
            <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px] text-text-primary">Forum</div>
            <div className="flex flex-row">
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-sm px-4 bg-opacity-40 h-[40px] w-[0px] lg:w-[0px] text-text-primary">Threads</div>
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-sm px-4 bg-opacity-40 h-[40px] w-[50px] lg:w-[125px] lg:pl-6 lg:pr-6 text-text-primary">Posts</div>
              <div className="flex rounded-t-xl rounded-l-none flex-1 items-center justify-center bg-[#474c79] text-center text-sm px-4 bg-opacity-40 h-[40px] lg:whitespace-nowrap w-[125px] lg:w-full lg:pr-10 text-text-primary">Last Post</div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Forum;
