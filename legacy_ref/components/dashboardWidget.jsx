import React from "react";
import { useState, useEffect } from "react";

const dashboardWidget = ({ linkedWalletAddress, embeddedWalletAddress, ready, selected }) => {
  const [price, setPrice] = useState("N/A");
  const [marketCap, setMarketCap] = useState("N/A");
  const [aquariBalance, setAquariBalance] = useState("N/A");

  useEffect(() => {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=aquari-2&vs_currencies=usd")
      .then((response) => response.json())
      .then((data) => {
        setPrice(data["aquari-2"].usd);
        console.log(`The price of Aquari is $${price}`);
      })
      .catch((error) => console.error("Error fetching Aquari price data:", error));

    fetch("https://api.coingecko.com/api/v3/coins/aquari-2")
      .then((response) => response.json())
      .then((data) => {
        // Assuming 'fully_diluted_valuation' is a field in the response
        setMarketCap(data.market_data.fully_diluted_valuation.usd.toLocaleString());
        console.log(`The fully diluted valuation of Aquari is $${marketCap}`);
      })
      .catch((error) => console.error("Error fetching Aquari Market Cap data:", error));
  }, [1]);

  //Use Effect to Load Aquari Balance Through Privy Wallet
  useEffect(() => {
    const apiKey = "CYUIGVTX1VKY3HVYCZYW2TVXXWGQU4VC1A";
    var walletAddress = "0x13B9110A72A8D08A4c08c411143AEDbf0c3FC235"; //Default Will Change When App Starts Below In React Body
    const contractAddress = "0x7F0E9971D3320521Fc88F863E173a4cddBB051bA";

    console.log("Dashboard Widget Privy Balance UseEffect Entered (Linked)");
    console.log("Embedded Wallet Address", embeddedWalletAddress);
    //Checks for Linked Wallet
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
    //Checks for Embedded Wallet
    if (embeddedWalletAddress) {
      console.log("Dashboard Widget Privy Balance If Statement Entered (Embedded)");
      console.log("Linked Wallet Address Check", embeddedWalletAddress);
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
  }, [linkedWalletAddress, embeddedWalletAddress]);

  return (
    <div className="flex shadowz items-center px-8 space-x-0.5 py-[40px] flex-row h-1/3 mt-[50px] w-full bg-[#1d1f31] bg-opacity-80 rounded-lg transition-transform hover:scale-[101%] duration-300 select-none">
      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold tracking-wider ">AQUARI Balance</h1>
        <h1 className="text-sm">{`${aquariBalance.toLocaleString("en-US", { maximumFractionDigits: 0 })} AQUARI`}</h1>
        <h1 className="text-sm">${(aquariBalance * price).toLocaleString("en-US", { maximumFractionDigits: 2 })}</h1>
      </div>

      <div className="flex-1 text-center ">
        <h1 className="text-lg font-semibold tracking-wider flex-nowrap">AQUARI Market Cap</h1>
        <h1 className="text-sm">${marketCap}</h1>
      </div>

      <div className="flex-1 text-center">
        <h1 className="text-lg font-semibold tracking-wider">AQUARI Price</h1>
        <h1 className="text-sm">${price.toLocaleString("en-US", { maximumFractionDigits: 4 })}</h1>
      </div>
    </div>
  );
};

export default dashboardWidget;
