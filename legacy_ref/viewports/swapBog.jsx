import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import { useContext } from "react";
import { BlockchainContext } from "../pages/home";
import Dashboard from "../components/walletDashboardWidget";
import Footer from "../components/buyFooter";
import Modal from "../components/disclaimerModal";
import { ShieldButton } from "shield-pay-sdk";
import "shield-pay-sdk/dist/index.css";
import "../index.css";
import callAquariServer from "../apis/callAquariServer";

//PancakeSwap Router Contract ABI and Address
import PANCAKESWAP_ROUTER_ABI from "../components/pancakeswapRouterABI.json";
const PANCAKESWAP_ROUTER_ADDRESS = "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24";

// Aquari Token Address
import AQUARI_ABI from "../components/aquariABI.json";
import USDC_ABI from "../components/usdcABI.json";
const AQUARI_TOKEN_ADDRESS = "0x7F0E9971D3320521Fc88F863E173a4cddBB051bA";
const USDC_TOKEN_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const usdcInterface = new ethers.utils.Interface(USDC_ABI);
const aquariInterface = new ethers.utils.Interface(AQUARI_ABI);

const swapBog = ({ user }) => {
  const { privySigner, provider, embeddedWalletAddress, linkedWalletAddress, walletBalance } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(embeddedWalletAddress);
  const [inputValue, setInputValue] = useState("0");
  const [aquariInputValue, setAquariInputValue] = useState("0");
  const [withdrawInputValue, setWithdrawInputValue] = useState("0");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transactionSubmitted, setTransactionSubmitted] = useState(false);
  const privySignerAddress = privySigner;
  console.log("Captured Privy Signer", privySigner);
  console.log("Captured Privy Embedded Address", embeddedWalletAddress);
  console.log("Captured Privy Linked Address", linkedWalletAddress);
  console.log("Connected Wallet Address:", connectedWallet);

  // Function to trigger dashboard refresh
  const triggerDashboardRefresh = () => {
    setTransactionSubmitted((prev) => !prev);
  };

  const handleChangeRecipient = (event) => {
    setRecipientAddress(event.target.value);
  };

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleWithdrawChange = (event) => {
    setWithdrawInputValue(event.target.value);
  };

  const handleAquariChange = (event) => {
    setAquariInputValue(event.target.value);
  };

  //Regular Expression to Extract Reason from ErrorMessage String
  function extractReasonFromErrorMessage(errorMessage) {
    const reasonPattern = /reason="(.*?)"/;
    const match = reasonPattern.exec(errorMessage);

    if (match && match[1]) {
      return match[1];
    } else {
      return "Error: Please Check your Inputs. If the problem persists please notify Developers in Aquari Telegram";
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Gas Sponsorship Wallet", connectedWallet);
    const response = await callAquariServer.post("/eth/check-and-airdrop", {
      address: connectedWallet,
    });
    console.log("Gas Sponsorship Check Completed", response);
    await approveUSDC();
    console.log("Waiting for Approval to Complete");
    await swapBNBForAquari();
    console.log("Waiting for Swap to Complete");
    console.log("Handle Submit Completed");
    triggerDashboardRefresh(); // Trigger refresh after transaction
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    console.log("Gas Sponsorship Wallet", connectedWallet);
    const response = await callAquariServer.post("/eth/check-and-airdrop", {
      address: connectedWallet,
    });
    console.log("Gas Sponsorship Check Completed", response);
    await approveAquari();
    console.log("Waiting for Approval to Complete");
    await swapAquariForBNB();
    console.log("Waiting for Swap to Complete");
    console.log("Handle Submit 2 Completed");
    triggerDashboardRefresh(); // Trigger refresh after transaction
  };

  const approveAquari = async () => {
    try {
      console.log("Trying to Approve Aquari Tokens");
      const approveTx = await tokenContract.approve(PANCAKESWAP_ROUTER_ADDRESS, ethers.utils.parseUnits(aquariInputValue, 18));
      await approveTx.wait();
      console.log("Approval successful! Aquari Tokens:", ethers.utils.parseUnits(aquariInputValue, 18));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  const approveUSDC = async () => {
    try {
      console.log("Trying to Approve USDC Tokens");
      const approveTx = await tokenContract2.approve(PANCAKESWAP_ROUTER_ADDRESS, ethers.utils.parseUnits(inputValue, 6));
      await approveTx.wait();
      console.log("Approval successful! USDC Tokens:", ethers.utils.parseUnits(inputValue, 6));
    } catch (error) {
      console.error("Approval failed:", error);
    }
  };

  useEffect(() => {
    if (linkedWalletAddress != "") {
      setConnectedWallet(linkedWalletAddress);
    } else {
      setConnectedWallet(embeddedWalletAddress);
    }
  }, [linkedWalletAddress, embeddedWalletAddress]);

  const pancakeSwapRouterContract = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, PANCAKESWAP_ROUTER_ABI, provider);
  const tokenContract = new ethers.Contract(AQUARI_TOKEN_ADDRESS, AQUARI_ABI, privySigner);
  const tokenContract2 = new ethers.Contract(USDC_TOKEN_ADDRESS, USDC_ABI, privySigner);

  //Swap USDC For Aquari
  const swapBNBForAquari = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if privySigner.address is defined
      if (!privySigner) {
        setError("User's wallet is not connected");
        return;
      }

      const routerContract = pancakeSwapRouterContract.connect(privySigner);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time
      const tx = await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseUnits(inputValue, "6"), // Amount of USDC tokens to swap (6 decimals)
        ethers.utils.parseUnits("0", "18"), // Minimum amount of Aquari to receive (18 decimals)
        ["0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", "0x4200000000000000000000000000000000000006", AQUARI_TOKEN_ADDRESS], // Path: Aquari -> USDC
        connectedWallet, // Address to receive the Aquari
        deadline, // Deadline timestamp
        { gasLimit: 500000 } // Transaction options
      );
      await tx.wait();
      console.log("Swap successful!");
    } catch (error) {
      console.error("Swap failed:", error);
      setError(extractReasonFromErrorMessage(error.message));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  //Swaps Aquari for USDC
  const swapAquariForBNB = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if privySigner.address is defined
      if (!privySigner) {
        setError("User's wallet is not connected");
        return;
      }

      const routerContract = pancakeSwapRouterContract.connect(privySigner);

      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current time
      console.log("Trying to Initate Swap of Aquari Tokens:", aquariInputValue);
      const tx = await routerContract.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        ethers.utils.parseUnits(aquariInputValue, "18"), // Amount of Aquari tokens to swap (18 decimals)
        ethers.utils.parseUnits("0", "6"), // Minimum amount of USDC to receive (6 decimals)
        [AQUARI_TOKEN_ADDRESS, "0x4200000000000000000000000000000000000006", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"], // Path: Aquari -> USDC
        connectedWallet, // Address to receive the USDC
        deadline, // Deadline timestamp
        { gasLimit: 500000 } // Transaction options
      );
      await tx.wait();
      console.log("Swap successful! Aquari Tokens:", aquariInputValue);
    } catch (error) {
      console.error("Swap failed:", error);
      setError(extractReasonFromErrorMessage(error.message));
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendBNB = async (event) => {
    event.preventDefault();
    console.log("Gas Sponsorship Wallet", connectedWallet);
    const response = await callAquariServer.post("/eth/check-and-airdrop", {
      address: connectedWallet,
    });
    console.log("Gas Sponsorship Check Completed", response);
    if (!privySigner) {
      setError("Wallet is not connected");
      return;
    }
    try {
      setLoading(true);
      // Generate the calldata for the transfer function
      const calldata = usdcInterface.encodeFunctionData("transfer", [
        recipientAddress,
        ethers.utils.parseUnits(inputValue, 6), // USDC has 6 decimals
      ]);
      // Send the transaction using privySigner to trigger the Privy modal
      const tx = await privySigner.sendTransaction({
        to: USDC_TOKEN_ADDRESS,
        data: calldata,
        value: ethers.utils.parseEther("0"), // No ETH being sent, so zero value
      });
      await tx.wait();
      console.log(`USDC transfer successful: ${tx.hash}`);
      setError(null);
      triggerDashboardRefresh(); // Trigger refresh after transaction
    } catch (err) {
      console.error("Error sending USDC:", err);
      setError(`Failed to send USDC: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendAquari = async (event) => {
    event.preventDefault();
    console.log("Gas Sponsorship Wallet", connectedWallet);
    const response = await callAquariServer.post("/eth/check-and-airdrop", {
      address: connectedWallet,
    });
    console.log("Gas Sponsorship Check Completed", response);
    if (!privySigner) {
      setError("Wallet is not connected");
      return;
    }
    try {
      setLoading(true);
      // Generate the calldata for the transfer function
      const calldata2 = aquariInterface.encodeFunctionData("transfer", [
        recipientAddress,
        ethers.utils.parseUnits(withdrawInputValue, 18), // Aquari has 18 decimals
      ]);
      // Send the transaction using privySigner to trigger the Privy modal
      const tx = await privySigner.sendTransaction({
        to: AQUARI_TOKEN_ADDRESS,
        data: calldata2,
        value: ethers.utils.parseEther("0"), // No ETH being sent, so zero value
      });
      await tx.wait();
      console.log(`Aquari transfer successful: ${tx.hash}`);
      setError(null);
      triggerDashboardRefresh(); // Trigger refresh after transaction
    } catch (err) {
      console.error("Error sending Aquari:", err);
      setError(`Failed to send Aquari: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-[#000000] overflow-y-auto bg-opacity-40 h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-3 md:mt-4 lg:mt-4 font-semibold tracking-wider">{`My Wallet`}</h1>
          <p className="mt-2 text-sm text-white">{`BASE Chain Address: ${connectedWallet}`}</p>
          <Dashboard
            walletBalance={walletBalance}
            linkedWalletAddress={linkedWalletAddress}
            embeddedWalletAddress={embeddedWalletAddress}
            transactionSubmitted={transactionSubmitted}
          />
        </div>

        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`1) Deposit Cash`}</h1>
          <button
            onClick={() => window.open(`https://buy.onramper.com/?apiKey=pk_prod_01GZXWJF7DNX8FSP2HK7W0KT53&onlyCryptos=usdc_base&mode=buy&onlyOnramps=banxa&networkWallets=base:${connectedWallet}&defaultFiat=eur&defaultAmount=55&defaultPaymentMethod=ideal#`)}
            disabled={loading}
            className="bg-[#232734] bg-opacity-70 shadowz mt-4 w-full h-[70px] hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer">
            {"Purchase USDC using Debit Card / iDeal"}
          </button>
          <div className="mt-3">
            <ShieldButton
              apiKey="sk_live_xULDaXe2MvzzGpgvMCG6rhqiNlhLn90mFa"
              address={connectedWallet}
              redirectURI="https://app.aquari.org"
            />
          </div>

          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`2) Manage Wallet`}</h1>
          <form
            className="mt-6"
            onSubmit={handleSubmit}>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Aquari Currency Converter
            </label>
            <label
              htmlFor="email"
              className="block mb-2 mt-4 text-xs font-medium text-gray-900 dark:text-white">
              Convert USDC into Aquari
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={inputValue}
              onChange={handleChange}
              defaultValue="0"
            />
            <p className="text-xs mt-3 font-semibold text-yellow-500">*This operation requires 2 transactions (Enter Amount of USDC)</p>
            <button
              className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit">
              {loading ? "Swapping..." : "USDC -> Aquari"}
            </button>
          </form>

          <form
            className="mt-6"
            onSubmit={handleSubmit2}>
            <label
              htmlFor="email"
              className="block mb-2 text-xs font-medium text-gray-900 dark:text-white">
              Convert Aquari into USDC
            </label>

            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              defaultValue="0"
              value={aquariInputValue}
              onChange={handleAquariChange}
            />
            <p className="text-xs mt-3 font-semibold text-yellow-500">*This operation requires 2 transactions (Enter Amount of Aquari Tokens)</p>
            <button
              className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit">
              {loading ? "Swapping..." : "Aquari -> USDC"}
            </button>
          </form>
          <form
            className="mt-12"
            onSubmit={sendBNB}>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Withdraw USDC to Exchange or External Wallet
            </label>
            <label
              htmlFor="email"
              className="block mb-2 mt-4 text-xs font-medium text-gray-900 dark:text-white">
              USDC Amount
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={inputValue}
              onChange={handleChange}
              defaultValue="0"
            />
            <label
              htmlFor="email"
              className="block mt-6 mb-2 text-xs font-medium text-gray-900 dark:text-white">
              Base Wallet Address
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              onChange={handleChangeRecipient}
            />
            <div className="flex flex-row gap-2">
              <button
                className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
                type="submit">
                {"Cash Out USDC"}
              </button>
            </div>
          </form>
          <form
            className="mt-12"
            onSubmit={sendAquari}>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium  dark:text-white">
              Withdraw Aquari to External Wallet
            </label>
            <label
              htmlFor="email"
              className="block mb-2 mt-4 text-xs font-medium dark:text-white">
              Aquari Amount
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300  text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={withdrawInputValue}
              onChange={handleWithdrawChange}
              defaultValue="0"
            />
            <label
              htmlFor="email"
              className="block mt-6 mb-2 text-xs font-medium  dark:text-white">
              Base Wallet Address
            </label>
            <input
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              onChange={handleChangeRecipient}
            />
            <div className="flex flex-row gap-2">
              <button
                className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
                type="submit">
                {"Cash Out Aquari"}
              </button>
            </div>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default swapBog;
