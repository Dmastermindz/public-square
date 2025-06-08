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
import CameronPic from "../../assets/logo.png";

//Import Components
import FormCategory from "../../components/forumCategory";
import NewInviteOverlay from "../../components/newInviteOverlay";

//Import Context API
import { useContext } from "react";
import { BlockchainContext } from "../../pages/home";

const userProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
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
    <div className="bg-[#000000] bg-opacity-[74%] p-4 md:p-12 md:pt-7 min-h-full overflow-y-scroll">
      <NewInviteOverlay
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex flex-col">
        <h1
          onClick={() => {
            setSelected("Forum");
          }}
          className="text-lg font-semibold cursor-pointer select-none tracking-wide">
          {"< Back to Community"}
        </h1>
        <h1 className="text-xl mt-[20px] lg:text-2xl font-semibold cursor-pointer select-none tracking-wide">{"My Profile"}</h1>
        <button
          onClick={() => {
            // setIsOpen(true);
          }}
          className="bg-green-900 mt-1 opacity-80 flex items-center justify-center text-white font-semibold text-md w-[100px] h-[30px] rounded-md  cursor-pointer">
          Aquarian
        </button>
      </div>

      <div className="mt-4 w-full h-auto flex flex-col xl:flex-row gap-4">
        <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full xl:w-1/2 h-auto flex-shrink-0">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Biography</div>
              <div className="flex flex-row"></div>
            </div>

            <div className="flex flex-col text-center items-center justify-center">
              <img
                src={CameronPic}
                className="flex h-[285px] lg:h-[425px] rounded-none mt-8 lg:mt-8"
              />
              <p className="mt-6 p-8">Hello, I am a loyal Aquarian dedicated to environmental conservation. As a passionate advocate for our planet's ecosystems, I work tirelessly to protect and preserve our natural world. Through research, education, and community outreach, I strive to create a sustainable future for all living beings. Together, we can make a difference.</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full xl:w-1/2">
          <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full h-[200px] xl:h-1/2">
            <div className="flex flex-col w-full rounded-xl">
              <div className="flex flex-row rounded-xl ">
                <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Badges (NFTs)</div>
                <div className="flex flex-row"></div>
              </div>
              <p className="flex h-full justify-center items-center">No Data</p>
            </div>
          </div>
          <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full h-[200px] xl:h-1/2">
            <div className="flex flex-col w-full rounded-xl">
              <div className="flex flex-row rounded-xl ">
                <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Friends</div>
                <div className="flex flex-row"></div>
              </div>
              <div className="flex h-full justify-end pr-4">
                <button
                  onClick={() => setIsOpen(true)}
                  className="bg-gray-300 hover:bg-gray-400 transition-all ease-in-out duration-200  flex items-center justify-center text-black font-semibold text-md mt-4 w-[90px] h-[37px] p-[9px] rounded-md cursor-pointer">
                  Invite
                </button>
              </div>
              <p className="flex h-full justify-center">Display Coming Soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 */}

      <div className="mt-6 w-full h-1/2 flex flex-col lg:flex-row gap-4">
        <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-1/2 h-full">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Statistics</div>
              <div className="flex flex-row"></div>
            </div>
            <p className="flex h-full justify-center items-center">No Data</p>
          </div>
        </div>
        <div className="flex  mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-1/2 h-full">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Past Cleanups</div>
              <div className="flex flex-row"></div>
            </div>
            <p className="flex h-full justify-center items-center">No Data</p>
          </div>
        </div>
      </div>

      {/* Row 3 */}

      <div className="mt-6 w-full h-1/2 flex flex-col lg:flex-row gap-4">
        <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-1/2 h-full">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Recent Posts</div>
              <div className="flex flex-row"></div>
            </div>
            <p className="flex h-full justify-center items-center">No Data</p>
          </div>
        </div>
        <div className="flex  mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-1/2 h-full">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Aquarian Loyalty</div>
              <div className="flex flex-row"></div>
            </div>
            <p className="flex h-full justify-center items-center">No Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default userProfile;
