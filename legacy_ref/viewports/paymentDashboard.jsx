import React from "react";
import Footprint from "../components/footprintVerify";
import ShieldPayForm from "../components/shieldPay.jsx";

const PaymentDashboard = () => {
  return (
    <div className="bg-[#000000] overflow-y-auto bg-opacity-40 h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4">
      <Footprint />
      <ShieldPayForm />
    </div>
  );
};

export default PaymentDashboard;

// import React, { useContext, useState } from "react";
// import { BlockchainContext } from "../pages/home";

// const PaymentDashboard = () => {
//   const { setSelected } = useContext(BlockchainContext);

//   // Complete logical data for each month of every year
//   const paymentData = {
//     2022: Array.from({ length: 12 }, (_, i) => ({
//       month: new Date(2022, i).toLocaleString("default", { month: "long" }),
//       amount: Math.random() > 0.5 ? 10 : 15,
//       status: Math.random() > 0.7 ? "Unpaid" : "Paid",
//       dueDate: `2022-${String(i + 1).padStart(2, "0")}-28`,
//     })),
//     2023: Array.from({ length: 12 }, (_, i) => ({
//       month: new Date(2023, i).toLocaleString("default", { month: "long" }),
//       amount: Math.random() > 0.5 ? 10 : 20,
//       status: Math.random() > 0.7 ? "Unpaid" : "Paid",
//       dueDate: `2023-${String(i + 1).padStart(2, "0")}-28`,
//     })),
//     2024: Array.from({ length: 12 }, (_, i) => ({
//       month: new Date(2024, i).toLocaleString("default", { month: "long" }),
//       amount: Math.random() > 0.5 ? 10 : 20,
//       status: i > 9 ? "Future" : Math.random() > 0.7 ? "Unpaid" : "Paid", // Future for Nov & Dec
//       dueDate: `2024-${String(i + 1).padStart(2, "0")}-28`,
//     })),
//   };

//   const [selectedYear, setSelectedYear] = useState(2024);
//   const [selectedBill, setSelectedBill] = useState(null);

//   const handleBillClick = (bill) => setSelectedBill(bill);

//   const getBlockColor = (status) => {
//     if (status === "Paid") return "bg-green-500";
//     if (status === "Unpaid") return "bg-red-500";
//     return "bg-gray-500"; // Future months
//   };

//   return (
//     <div className="bg-[#000000] bg-opacity-[74%] p-6 md:p-12 min-h-screen overflow-y-scroll">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-extrabold text-center mb-6 text-white tracking-wide">Utility Billing Dashboard</h1>

//         <div className="bg-[#1d1f31] p-6 rounded-lg shadow-md shadow-gray-800 mb-6">
//           <h2 className="text-2xl font-semibold text-white mb-2">Outstanding Balance</h2>
//           <p className="text-4xl font-bold text-red-400">$45.00</p>
//           <p className="text-sm text-gray-400 mt-2">As of October 2024</p>
//         </div>

//         <div className="flex flex-col md:flex-row items-start mb-6 gap-4">
//           <select
//             value={selectedYear}
//             onChange={(e) => setSelectedYear(parseInt(e.target.value))}
//             className="bg-gray-800 text-white px-4 py-2 rounded-md shadow-sm">
//             <option value={2022}>2022</option>
//             <option value={2023}>2023</option>
//             <option value={2024}>2024</option>
//           </select>

//           <div className="flex-grow flex justify-center">
//             <div className="flex gap-8">
//               {Object.keys(paymentData).map((year) => (
//                 <div
//                   key={year}
//                   className="flex flex-col items-center">
//                   <p className="text-white font-medium mb-2">{year}</p>
//                   <div className="grid grid-cols-12 gap-[2px]">
//                     {paymentData[year].map((bill, index) => (
//                       <div
//                         key={index}
//                         className={`h-6 w-6 ${getBlockColor(bill.status)} rounded-sm`}
//                         title={`${bill.month}: ${bill.status} ($${bill.amount})`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="flex flex-col-reverse md:flex-row gap-6">
//           <div className="w-full md:w-1/2 bg-[#1d1f31] p-6 rounded-lg shadow-md shadow-gray-800">
//             <h2 className="text-2xl font-semibold text-white mb-4">Billing History</h2>
//             {paymentData[selectedYear].map((bill, index) => (
//               <div
//                 key={index}
//                 onClick={() => handleBillClick(bill)}
//                 className="flex flex-row items-center p-4 mb-4 cursor-pointer rounded-lg bg-[#2b2f45] hover:bg-[#3a3f5c] transition-all">
//                 <div className="flex-grow">
//                   <h3 className="text-lg font-semibold text-white">{bill.month}</h3>
//                   <p className="text-sm text-gray-400">Amount: ${bill.amount}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="w-full md:w-1/2 bg-[#1d1f31] p-6 rounded-lg shadow-md shadow-gray-800">
//             <h2 className="text-2xl font-semibold text-white mb-4">Bill Details</h2>
//             {selectedBill ? (
//               <div>
//                 <h3 className="text-xl font-bold text-white mb-2">{selectedBill.month} Bill</h3>
//                 <p className="mb-2 text-sm text-gray-400">Due Date: {selectedBill.dueDate}</p>
//                 <p className="mb-2 text-sm text-gray-400">Status: {selectedBill.status}</p>
//                 <p className="mb-2 text-sm text-gray-400">Amount: ${selectedBill.amount}</p>

//                 <h4 className="text-lg font-semibold text-white mt-4">Service Summary</h4>
//                 <ul className="list-disc list-inside text-sm text-gray-400 mb-4">
//                   <li>Garbage Pickup Service: Weekly</li>
//                   <li>Waste Management Fee: Included</li>
//                   <li>Environmental Tax: $2.00</li>
//                 </ul>

//                 <h4 className="text-lg font-semibold text-white mt-4">Payment Method</h4>
//                 <p className="text-sm text-gray-400 mb-4">Credit Card (**** **** **** 1234)</p>

//                 <h4 className="text-lg font-semibold text-white mt-4">Late Fee</h4>
//                 <p className="text-sm text-gray-400">{selectedBill.status === "Unpaid" ? "$5.00 Late Fee Applies" : "No Late Fee"}</p>
//               </div>
//             ) : (
//               <p className="text-sm text-gray-400">Select a bill from the left to view details.</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentDashboard;
