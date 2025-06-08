import React from "react";
import { useEffect } from "react";
import { ActiveContext } from "../../pages/home";
import { usePrivy } from "@privy-io/react-auth";

//Import Icons
import { BsInstagram } from "react-icons/bs";
import { BsLinkedin } from "react-icons/bs";
import { BsFacebook } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import { useContext } from "react";

import NewsCard from "../../components/newsCardNoClick";
import DashboardWidget from "../../components/dashboardWidget";

//Import Images
import Cleanup from "../../assets/pep.jpg";
import Story1 from "../../assets/news/story1.jpg";
import Story2 from "../../assets/news/malhar.jpg";
import Story3 from "../../assets/news/pepinster.jpg";
import Story4 from "../../assets/news/beachplease.jpg";
import Story5 from "../../assets/news/aquarifam.jpg";
import Story6 from "../../assets/news/pepinstergroup.jpg";
import Story7 from "../../assets/news/dadar.jpg";
import Story8 from "../../assets/news/mumbai.jpg";

//Import Components
import ProposalUnit from "../../components/proposalUnit";

const signIn = ({ logout, auth, setSelected, setJsx, setNewsObject, selected, ready }) => {
  const newsList = [
    {
      headline: "Aquari Launches Revolutionary Blockchain Initiative to Restore Coral Reefs",
      category: "Cleanup",
      image: Story3,
      date: "August 8th 2024",
      article_text: `Aquari has unveiled a groundbreaking blockchain-based project aimed at ocean conservation. The initiative leverages blockchain technology to incentivize individuals and groups to participate in ocean cleanup efforts. By using a decentralized platform, Aquari ensures transparency and efficiency in tracking environmental impact. Participants in the cleanup operations are rewarded with Aquari tokens, which can be traded or used within the ecosystem. This approach not only motivates more people to join the cause but also creates a sustainable cycle of conservation efforts. The token incentives are designed to attract a diverse group of environmentalists, from individual volunteers to large organizations. The project has already garnered attention from major environmental groups and blockchain enthusiasts alike. With its innovative use of technology for environmental good, Aquari is setting a new standard for how blockchain can be used to foster and finance ecological initiatives.`,
    },
    {
      headline: "Aquari's New Blockchain Solution Targets Plastic Pollution in Oceans, Offers Token Rewards",
      category: "News",
      image: Story2,
      date: "April 16th 2024",
      article_text:
        "Aquari has launched a new app that transforms how donors contribute to environmental causes. The app, built on blockchain technology, allows donors to directly fund specific environmental projects and track the impact of their contributions in real-time. This direct connection ensures that every dollar donated is used efficiently and transparently. The app features various projects, from local tree planting to large-scale ocean cleanups. Donors can choose projects based on their interests and see the tangible impact of their contributions. The platform also rewards donors with Aquari tokens, which can appreciate in value, offering a potential return on their investment. This innovative approach to environmental philanthropy is changing the game. By aligning financial incentives with environmental impact, Aquari is attracting a new wave of investors who are interested in making a difference while potentially earning from their contributions.",
    },
    {
      headline: "Innovative Aquari Platform Empowers Local Communities with Token-Based Reforestation Projects",
      category: "Update",
      image: Cleanup,
      date: "June 22nd 2024",
      article_text:
        "The Aquari token has seen a significant surge in value as more individuals and organizations participate in environmental impact labor. This increase reflects the growing popularity and effectiveness of Aquari's model, which incentivizes environmental work through blockchain-based rewards. The rise in token value is attributed to the successful completion of several high-profile environmental projects, including major reforestation efforts and wildlife conservation initiatives. As participants earn Aquari tokens for their labor, the demand for the token increases, driving up its value. Experts believe that the success of the Aquari token could pave the way for more blockchain-based environmental initiatives. The model not only provides a financial incentive for conservation work but also creates a scalable and sustainable approach to tackling environmental challenges.",
    },
    {
      headline: "Decentralized Environmental Impact: Aquari's Pioneering Approach to Wildlife Conservation",
      category: "News",
      image: Story4,
      date: "March 17th 2024",
      article_text:
        "Aquari has introduced an innovative blockchain solution aimed at revolutionizing wildlife conservation. The platform allows conservationists to receive funding and support through Aquari tokens, which are earned by contributing to wildlife protection efforts. The system ensures that funds are allocated efficiently and transparently, allowing donors to see the direct impact of their contributions. This approach has significantly increased engagement in wildlife conservation projects, as both donors and laborers are incentivized through the Aquari ecosystem. The success of this initiative has caught the attention of conservation groups worldwide. By leveraging blockchain technology, Aquari is not only supporting wildlife conservation but also demonstrating how technology can be harnessed for the greater good of the planet.",
    },
    {
      headline: "Aquari Unveils Groundbreaking Token System to Finance Renewable Energy Projects",
      category: "Patch",
      image: Story5,
      date: "November 6th 2024",
      article_text:
        "Aquari is pioneering transparent environmental funding through its decentralized blockchain platform. The platform allows donors to track every dollar they contribute to environmental projects, ensuring that their funds are used effectively. This level of transparency is revolutionizing how environmental projects are funded and executed. Donors are more confident in their contributions, knowing that they can see the direct impact of their investments. Aquari's commitment to transparency is setting a new standard in environmental funding. The platform's success demonstrates the potential of blockchain technology in creating a more accountable and efficient system for environmental philanthropy.",
    },
    {
      headline: "Blockchain Meets Green: Aquari's Token Incentives Drive Massive Reforestation Efforts",
      category: "AMA",
      image: Story6,
      date: "July 10th 2024",
      article_text:
        "Aquari is setting new standards in reforestation efforts through its innovative use of blockchain technology. The platform incentivizes individuals and groups to participate in tree planting initiatives, with rewards in the form of Aquari tokens. The transparent tracking of reforestation efforts on the blockchain ensures that every tree planted is accounted for, providing donors and participants with clear evidence of the impact. This level of transparency and accountability is unprecedented in environmental initiatives. The success of Aquari's reforestation projects is a significant step forward in the fight against climate change. By combining environmental action with blockchain technology, Aquari is making a tangible difference in global reforestation efforts.",
    },
    {
      headline: "Aquari Sets New Standard in Environmental Responsibility with Blockchain-Enabled Water Purification Projects",
      category: "News",
      image: Story7,
      date: "September 7th 2024",
      article_text:
        "Aquari is bridging the gap between environmental activism and profit through its unique blockchain platform. The platform rewards participants with Aquari tokens for their environmental efforts, creating a profitable model for conservation work. This approach has attracted a new demographic of environmental activists who are motivated by both the desire to make a difference and the potential for financial gain. The platform's success lies in its ability to align financial incentives with environmental goals. Aquari's model is reshaping how environmental activism is perceived and executed. By providing a profitable avenue for conservation efforts, Aquari is encouraging more people to engage in environmental activism.",
    },
    {
      headline: "Empowering Sustainable Agriculture: Aquari's Blockchain Platform Incentivizes Organic Farming in densse tropical zones.",
      category: "News",
      image: Story8,
      date: "July 14th 2024",
      article_text:
        "Aquari is driving global environmental change through its token-based incentive system. The platform rewards individuals and organizations with Aquari tokens for their contributions to environmental projects, creating a global network of conservation efforts. This incentive model has led to a significant increase in environmental activities worldwide, as more people are motivated to participate in conservation efforts. The Aquari token has become a symbol of environmental action, with its value directly linked to the impact of the projects it funds. The global reach of Aquari's platform is a testament to the power of combining technology with environmental activism. The token-based system is not only driving change but also creating a sustainable model for future environmental initiatives.",
    },
  ];

  return (
    <div className=" bg-[#000000] overflow-y-auto bg-opacity-80  h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4 ">
      <div className="mx-[0%] md:mx-[5%] xl:mx-[7%] 2xl:mx-[14%]">
        <h1 className="text-3xl mt-[35px] font-semibold tracking-wider">Latest News</h1>
        <div className="flex mt-[35px] w-full gap-x-[25px] gap-y-4 flex-wrap">
          {newsList.map((item) => {
            return (
              <NewsCard
                setNewsObject={setNewsObject}
                item={item}
                setSelected={setSelected}
                selected={selected}
                // login={login}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default signIn;
