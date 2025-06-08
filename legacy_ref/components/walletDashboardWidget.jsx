import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers"; // Make sure ethers is imported

const dashboardWidget = ({ linkedWalletAddress, embeddedWalletAddress, walletBalance, ready, selected, transactionSubmitted }) => {
  const [price, setPrice] = useState("N/A");
  const [bnbPrice, setBnbPrice] = useState("N/A");
  const [marketCap, setMarketCap] = useState("N/A");
  const [aquariBalance, setAquariBalance] = useState("N/A");
  const [usdcBalance, setUSDCBalance] = useState("N/A");
  const [bnbBalance, setBnbBalance] = useState("N/A");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Watch for transaction submissions from parent component
  useEffect(() => {
    if (transactionSubmitted) {
      // Set a timer to refresh balances after 8 seconds
      const timer = setTimeout(() => {
        setRefreshTrigger((prev) => prev + 1);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [transactionSubmitted]);

  // Fetch token prices
  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=aquari-2&vs_currencies=usd")
      .then((response) => response.json())
      .then((data) => {
        setPrice(data["aquari-2"].usd);
        console.log(`The price of Aquari is $${price}`);
      })
      .catch((error) => console.error("Error fetching Aquari price data:", error));

    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd")
      .then((response) => response.json())
      .then((data) => {
        setBnbPrice(data.ethereum.usd);
        console.log(`The price of ETH is $${bnbPrice}`);
      })
      .catch((error) => console.error("Error fetching ETH price data:", error));

    fetch("https://api.coingecko.com/api/v3/coins/aquari-2")
      .then((response) => response.json())
      .then((data) => {
        // Assuming 'fully_diluted_valuation' is a field in the response
        setMarketCap(data.market_data.fully_diluted_valuation.usd.toLocaleString());
        console.log(`The fully diluted valuation of Aquari is $${marketCap}`);
      })
      .catch((error) => console.error("Error fetching Aquari Market Cap data:", error));
  }, [refreshTrigger]); // Add refreshTrigger to dependencies to re-fetch when transactions are submitted

  // Fetch USDC Balance
  useEffect(() => {
    const apiKey = "CYUIGVTX1VKY3HVYCZYW2TVXXWGQU4VC1A";
    const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

    console.log("Dashboard Widget Privy Balance UseEffect Entered (Linked)");
    // Checks for Linked Wallet
    if (linkedWalletAddress) {
      console.log("Dashboard Widget Privy Balance If Statement Entered");
      console.log("Linked Wallet Address Check", linkedWalletAddress);
      const url = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${usdcAddress}&address=${linkedWalletAddress}&tag=latest&apikey=${apiKey}`;
      console.log("URL:", url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setBnbBalance(ethers.utils.formatEther(data.result));
          console.log(`The User's USDC balance is: ${bnbBalance}`);
        })
        .catch((error) => console.error("Error fetching User USDC Account Balance data:", error));
    }
    // Checks for Embedded Wallet
    if (embeddedWalletAddress && !linkedWalletAddress) {
      console.log("Dashboard Widget Privy Balance If Statement Entered (Embedded)");
      console.log("Embedded Wallet Address Check", embeddedWalletAddress);
      const url = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${usdcAddress}&address=${embeddedWalletAddress}&tag=latest&apikey=${apiKey}`;
      console.log("URL:", url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setUSDCBalance(Number(data.result / Math.pow(10, 6)));
          console.log(`The User's USDC balance is: ${usdcBalance}`);
        })
        .catch((error) => console.error("Error fetching User USDC Account Balance data:", error));
    }
  }, [linkedWalletAddress, embeddedWalletAddress, refreshTrigger]); // Add refreshTrigger to dependencies

  // Fetch Aquari Balance
  useEffect(() => {
    const apiKey = "CYUIGVTX1VKY3HVYCZYW2TVXXWGQU4VC1A";
    const contractAddress = "0x7F0E9971D3320521Fc88F863E173a4cddBB051bA";

    console.log("Dashboard Widget Privy Balance UseEffect Entered (Linked)");
    // Checks for Linked Wallet
    if (linkedWalletAddress) {
      console.log("Dashboard Widget Privy Balance If Statement Entered");
      console.log("Linked Wallet Address Check", linkedWalletAddress);
      const url = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${linkedWalletAddress}&tag=latest&apikey=${apiKey}`;
      console.log("URL:", url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setAquariBalance(Number(data.result / Math.pow(10, 18)));
          console.log(`The User's Aquari balance is: ${aquariBalance}`);
        })
        .catch((error) => console.error("Error fetching User Aquari Account Balance data:", error));
    }
    // Checks for Embedded Wallet
    if (embeddedWalletAddress && !linkedWalletAddress) {
      console.log("Dashboard Widget Privy Balance If Statement Entered (Embedded)");
      console.log("Embedded Wallet Address Check", embeddedWalletAddress);
      const url = `https://api.basescan.org/api?module=account&action=tokenbalance&contractaddress=${contractAddress}&address=${embeddedWalletAddress}&tag=latest&apikey=${apiKey}`;
      console.log("URL:", url);

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setAquariBalance(Number(data.result / Math.pow(10, 18)));
          console.log(`The User's Aquari balance is: ${aquariBalance}`);
        })
        .catch((error) => console.error("Error fetching User Aquari Account Balance data:", error));
    }
  }, [linkedWalletAddress, embeddedWalletAddress, refreshTrigger]); // Add refreshTrigger to dependencies

  return (
    <div className="flex shadowz items-center px-8 space-x-0.5 py-[40px] flex-row h-1/3 mt-[50px] w-full bg-[#1d1f31] bg-opacity-80 rounded-lg transition-transform hover:scale-[101%] duration-300">
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold tracking-wider ">USD Balance</h1>
        <h1 className="text-sm">${usdcBalance.toLocaleString("en-US", { maximumFractionDigits: 2 })}</h1>
      </div>

      <div className="flex-1 text-center ">
        <h1 className="text-lg font-semibold tracking-wider flex-nowrap">AQUARI Market Cap</h1>
        <h1 className="text-sm">${marketCap}</h1>
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold tracking-wider ">AQUARI Balance</h1>
        <h1 className="text-sm">{`${aquariBalance.toLocaleString("en-US", { maximumFractionDigits: 0 })} AQUARI`}</h1>
        <h1 className="text-sm">${(aquariBalance * price).toLocaleString("en-US", { maximumFractionDigits: 2 })}</h1>
      </div>
    </div>
  );
};

export default dashboardWidget;
