import React, { useState, useEffect } from "react";

//Import Aquari API
import CallAquariServer from "../../apis/callAquariServer";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import CameronPic from "../../assets/Cameron.jpg";
import { IoMdSearch } from "react-icons/io";

//Import Components
import FormCategory from "../../components/forumCategory";

//Import Context API
import { useContext } from "react";
import { BlockchainContext } from "../../pages/home";

const userSearch = () => {
  const { setSelected, user } = useContext(BlockchainContext);
  const [forumCategories, setForumCategories] = useState([]);
  const [forumForums, setForumForums] = useState([]);

  //Fetch Categories
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CallAquariServer.get("/categories");
        console.log("Full API Response:", response);

        if (response.data && response.data.data && response.data.data.categories) {
          const categories = response.data.data.categories;
          console.log("Categories from API:", categories);
          setForumCategories(categories);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (err) {
        console.error("Fetching categories:", err);
      }
    }
    fetchData();
  }, []);

  //Fetch Forums
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CallAquariServer.get("/forums");
        console.log("Full API Response:", response);

        if (response.data && response.data.data && response.data.data.forums) {
          const forums = response.data.data.forums;
          console.log("Forums from API:", forums);
          setForumForums(forums);
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (err) {
        console.error("Fetching Forums:", err);
      }
    }
    fetchData();
  }, []);

  //API Call to backend to Create a new User (Makes sure User can Create)
  useEffect(() => {
    const addUser = async () => {
      try {
        const response = await CallAquariServer.post("/users", {
          user_id: user.id.slice(10),
        });

        if (response.data.status === "success") {
          console.log("Successfuly Created a New User", response);
        }
      } catch (error) {
        console.error("Error Creating New User (User Probably Already Exists in DB):", error);
      }
    };
    addUser();
  }, []);

  return (
    <div className=" bg-[#000000] bg-opacity-[74%] p-4 md:p-12 md:pt-7 min-h-full overflow-y-scroll">
      <div className="flex flex-col">
        <h1
          onClick={() => {
            setSelected("Forum");
          }}
          className="text-lg font-semibold cursor-pointer select-none tracking-wide">
          {"< Back to Community"}
        </h1>

        <h1
          // onClick={() => {
          //   setSelected("Thread List");
          // }}
          className="text-xl mt-[20px] lg:text-2xl font-semibold cursor-pointer select-none tracking-wide">
          {"User Search"}
        </h1>

        {/* Search Button */}
        <div className="pt-2 mt-4  text-gray-600">
          <input
            className="border-2 opacity-[92%] border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Username"
          />
          <button
            type="submit"
            className="relative p-1 left-[-29px] top-[2px] bg-gray-500 bg-opacity-0 rounded transition ease-in-out duration-200 hover:bg-opacity-30">
            <IoMdSearch />
          </button>
        </div>
        <div className="flex mt-8 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-full min-h-[610px] overflow-y-scroll">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Search Results</div>
              <div className="flex flex-row"></div>
            </div>
            <p className="flex h-full justify-center items-center">No Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default userSearch;
