import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie as PieChart } from "react-chartjs-2";
import { useContext } from "react";
import { ActiveContext } from "../pages/home";
import { ProposalContext } from "../pages/home";

ChartJS.register(ArcElement, Tooltip, Legend);

// const params = {
//   extractYes: 3,
//   extractNo: 1,
// };

// export const data = {
//   labels: ["Yes", "No"],
//   datasets: [
//     {
//       label: "# of Votes",
//       data: [params.extractYes, params.extractNo],
//       backgroundColor: [
//         "rgba(255, 99, 132, 0.2)",
//         "rgba(54, 162, 235, 0.2)",
//         "rgba(255, 206, 86, 0.2)",
//         "rgba(75, 192, 192, 0.2)",
//         "rgba(153, 102, 255, 0.2)",
//         "rgba(255, 159, 64, 0.2)",
//       ],
//       borderColor: [
//         "rgba(255, 99, 132, 1)",
//         "rgba(54, 162, 235, 1)",
//         "rgba(255, 206, 86, 1)",
//         "rgba(75, 192, 192, 1)",
//         "rgba(153, 102, 255, 1)",
//         "rgba(255, 159, 64, 1)",
//       ],
//       borderWidth: 2,
//     },
//   ],
// };

// getProposalsFunc[activePage][3]
//getProposalsFunc[activePage][4]

const options = {
  maintainAspectRatio: true,
  plugins: {
    legend: {
      onClick: null, // Disable legend clickability
    },
  },
  // ... other options you might want to include
};

export function Pie() {
  const { activePage } = useContext(ActiveContext);
  const { getProposalsFunc } = useContext(ProposalContext); //This has all of our Blockchain Proposal Data in Array, we Parse to Display Chart
  console.log("Yes Votes:", Number(getProposalsFunc[activePage][2]));
  console.log("No Votes:", Number(getProposalsFunc[activePage][3]));
  if (
    !Number(getProposalsFunc[activePage][2]) == 0 ||
    !Number(getProposalsFunc[activePage][3]) == 0
  ) {
    return (
      <PieChart
        data={{
          labels: ["Yes", "No"],
          datasets: [
            {
              label: "# of Votes",
              data: [
                Number(getProposalsFunc[activePage][2]),
                Number(getProposalsFunc[activePage][3]),
              ],
              backgroundColor: [
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 2,
            },
          ],
        }}
        options={options}
      />
    );
  } else {
    return (
      <h1 className="flex flex-1 items-center justify-center tracking-wider text-xl md:text-2xl">
        No Blockchain Votes Registered
      </h1>
    );
  }
}
