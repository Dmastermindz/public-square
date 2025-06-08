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
  const [leaderboard, setLeaderboard] = useState([]);

  //Fetch Leaderboard
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await CallAquariServer.get("/leaderboard");

        if (response.data.status === "success") {
          console.log("Server Resposne (invites):", response);
          setLeaderboard(response.data.data);
          console.log("Leaderboard", response.data.data);
        }
      } catch (err) {
        console.error("Fetching Invites:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className=" bg-[#000000] bg-opacity-[74%] p-4 md:p-12 md:pt-7 min-h-full overflow-y-scroll overflow-x-hidden">
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
          {"Contest Leaderboard"}
        </h1>
        <p className="text-sm font-semibold tracking-wide italic">
          ID: <span className="text-green-600">{user.id.slice(10)}</span>
        </p>

        <div className="flex mt-4 rounded-xl bg-[#1d1f31] bg-opacity-0 shadowz w-full lg:w-full min-h-[610px] overflow-y-scroll overflow-x-hidden">
          <div className="flex flex-col w-full rounded-xl">
            <div className="flex flex-row rounded-xl ">
              <div className="flex rounded-t-xl flex-grow items-center justify-center bg-[#474c79] text-center px-4 bg-opacity-40 h-[40px]">Let's Make a Whale Contest Invites</div>
              <div className="flex flex-row"></div>
            </div>

            {Object.entries(
              leaderboard.reduce((acc, item) => {
                if (!acc[item.inviter_user_id]) {
                  acc[item.inviter_user_id] = [];
                }
                acc[item.inviter_user_id].push(item.invitee_user_id);
                return acc;
              }, {})
            ).map(([inviter_id, invitees], groupIndex) => (
              <div
                key={inviter_id}
                className="mb-6">
                <p className="flex mt-4 text-xs md:text-base justify-center font-bold">
                  <span className="mr-2">{`(${groupIndex + 1})`}</span>
                  Aquarian <span className="text-green-600 mx-1">{inviter_id}</span> invited:
                </p>
                {invitees.map((invitee_id, inviteeIndex) => (
                  <p
                    key={invitee_id}
                    className="flex mt-2 text-xs md:text-base justify-center ml-8">
                    <span className="text-yellow-300 font-semibold mx-1">{invitee_id}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default userSearch;
