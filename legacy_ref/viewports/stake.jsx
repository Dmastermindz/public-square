import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { BlockchainContext } from "../pages/home";
import { ethers } from "ethers";
import Dashboard from "../components/walletDashboardWidget";
import Footer from "../components/buyFooter";

// Import ABI for the AquariStakingContest
import AQUARI_STAKING_ABI from "../components/aquariStakingABI.json";
const AQUARI_STAKING_ADDRESS = "0x3B1b73BE80895E1F113B9F864a48f1e1EB7dd615";

// Aquari Token Address and ABI
import AQUARI_ABI from "../components/aquariABI.json";
const AQUARI_TOKEN_ADDRESS = "0x6500197a2488610aca288fd8e2dfe88ec99e596c";

const Stake = () => {
  const { privySigner, provider, embeddedWalletAddress, linkedWalletAddress, walletBalance } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connectedWallet, setConnectedWallet] = useState(embeddedWalletAddress);
  const [stakeAmount, setStakeAmount] = useState("0");
  const [unstakeAmount, setUnstakeAmount] = useState("0");
  const [userStake, setUserStake] = useState("0");
  const [totalStaked, setTotalStaked] = useState("0");
  const [isApproved, setIsApproved] = useState(false);
  const [userStakedBalance, setUserStakedBalance] = useState("0");
  const [contractBalance, setContractBalance] = useState("0");

  useEffect(() => {
    if (linkedWalletAddress !== "") {
      setConnectedWallet(linkedWalletAddress);
    } else {
      setConnectedWallet(embeddedWalletAddress);
    }
  }, [linkedWalletAddress, embeddedWalletAddress]);

  useEffect(() => {
    fetchStakingInfo();
    fetchUserStakedBalance();
    checkContractBalance();
  }, [privySigner, connectedWallet]);

  const fetchStakingInfo = async () => {
    if (privySigner && connectedWallet) {
      try {
        const stakingContract = new ethers.Contract(AQUARI_STAKING_ADDRESS, AQUARI_STAKING_ABI, privySigner);
        const tokenContract = new ethers.Contract(AQUARI_TOKEN_ADDRESS, AQUARI_ABI, privySigner);

        const userStakeAmount = await stakingContract.stakedBalances(connectedWallet);
        const totalStakedAmount = await stakingContract.totalStaked();
        const allowance = await tokenContract.allowance(connectedWallet, AQUARI_STAKING_ADDRESS);

        setUserStake(ethers.utils.formatUnits(userStakeAmount, 9));
        setTotalStaked(ethers.utils.formatUnits(totalStakedAmount, 9));
        setIsApproved(allowance.gt(0));
      } catch (error) {
        console.error("Error fetching staking info:", error);
        setError("Failed to fetch staking information. Please try again.");
      }
    }
  };

  const fetchUserStakedBalance = async () => {
    if (privySigner && connectedWallet) {
      try {
        const stakingContract = new ethers.Contract(AQUARI_STAKING_ADDRESS, AQUARI_STAKING_ABI, privySigner);
        const balance = await stakingContract.stakedBalances(connectedWallet);
        setUserStakedBalance(ethers.utils.formatUnits(balance, 9));
      } catch (error) {
        console.error("Error fetching staked balance:", error);
        setError("Failed to fetch your staked balance. Please try again.");
      }
    }
  };

  const checkContractBalance = async () => {
    if (privySigner) {
      try {
        const tokenContract = new ethers.Contract(AQUARI_TOKEN_ADDRESS, AQUARI_ABI, privySigner);
        const balance = await tokenContract.balanceOf(AQUARI_STAKING_ADDRESS);
        const formattedBalance = ethers.utils.formatUnits(balance, 9);
        setContractBalance(formattedBalance);
        console.log("Staking Contract Balance:", formattedBalance);
      } catch (error) {
        console.error("Error checking contract balance:", error);
      }
    }
  };

  const handleStakeChange = (event) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setStakeAmount(event.target.value);
    }
  };

  const handleUnstakeChange = (event) => {
    if (/^\d*\.?\d*$/.test(event.target.value)) {
      setUnstakeAmount(event.target.value);
    }
  };

  const approveAquari = async () => {
    try {
      setLoading(true);
      setError(null);
      const tokenContract = new ethers.Contract(AQUARI_TOKEN_ADDRESS, AQUARI_ABI, privySigner);
      const approveTx = await tokenContract.approve(AQUARI_STAKING_ADDRESS, ethers.constants.MaxUint256);
      await approveTx.wait();
      setIsApproved(true);
      console.log("Approval successful!");
    } catch (error) {
      console.error("Approval failed:", error);
      setError("Failed to approve token spending. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (event) => {
    event.preventDefault();
    if (!privySigner) {
      setError("Wallet is not connected");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      if (!isApproved) {
        await approveAquari();
      }
      const stakingContract = new ethers.Contract(AQUARI_STAKING_ADDRESS, AQUARI_STAKING_ABI, privySigner);
      const tx = await stakingContract.stake(ethers.utils.parseUnits(stakeAmount, 9));
      await tx.wait();
      console.log("Stake successful!");
      await fetchStakingInfo();
      await fetchUserStakedBalance();
      await checkContractBalance();
    } catch (error) {
      console.error("Stake failed:", error);
      setError("Failed to stake tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async (event) => {
    event.preventDefault();
    if (!privySigner) {
      setError("Wallet is not connected");
      return;
    }
    try {
      setLoading(true);
      setError(null);

      const unstakeAmountBN = ethers.utils.parseUnits(unstakeAmount, 9);
      const userStakedBalanceBN = ethers.utils.parseUnits(userStakedBalance, 9);

      if (unstakeAmountBN.gt(userStakedBalanceBN)) {
        throw new Error(`Insufficient staked balance. You only have ${userStakedBalance} AQUARI staked.`);
      }

      const stakingContract = new ethers.Contract(AQUARI_STAKING_ADDRESS, AQUARI_STAKING_ABI, privySigner);

      // Get the current gas price
      const gasPrice = await provider.getGasPrice();

      // Estimate gas with a buffer
      const gasEstimate = await stakingContract.estimateGas.unstake(unstakeAmountBN);
      const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer

      const tx = await stakingContract.unstake(unstakeAmountBN, {
        gasLimit: gasLimit,
        gasPrice: gasPrice,
      });

      await tx.wait();
      console.log("Unstake successful!");

      await fetchStakingInfo();
      await fetchUserStakedBalance();
      await checkContractBalance();
    } catch (error) {
      console.error("Unstake failed:", error);
      setError(error.message || "An error occurred while unstaking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="bg-[#000000] overflow-y-auto bg-opacity-40 h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4">
        {error && <p className="text-red-500">{error}</p>}
        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-3 md:mt-4 lg:mt-4 font-semibold tracking-wider">{`Aquari Staking`}</h1>
          <p className="mt-2 text-sm text-white">{`Connected Wallet: ${connectedWallet}`}</p>
          <Dashboard
            walletBalance={walletBalance}
            linkedWalletAddress={linkedWalletAddress}
            embeddedWalletAddress={embeddedWalletAddress}
          />
        </div>

        <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`Staking Information`}</h1>
          <p className="mt-2 text-sm text-white">{`Your Stake: ${parseFloat(userStake).toLocaleString()} AQUARI`}</p>
          <p className="mt-2 text-sm text-white">{`Total Staked: ${parseFloat(totalStaked).toLocaleString()} AQUARI`}</p>
          <p className="mt-2 text-sm text-white">{`Contract Balance: ${parseFloat(contractBalance).toLocaleString()} AQUARI`}</p>

          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`Stake Aquari`}</h1>
          <form
            className="mt-6"
            onSubmit={handleStake}>
            <label
              htmlFor="stake-amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Amount to Stake
            </label>
            <input
              id="stake-amount"
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={stakeAmount}
              onChange={handleStakeChange}
            />
            <button
              className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit"
              disabled={loading}>
              {loading ? "Staking..." : "Stake AQUARI"}
            </button>
          </form>

          <h1 className="text-3xl mt-12 md:mt-8 lg:mt-8 font-semibold tracking-wider">{`Unstake Aquari`}</h1>
          <p>NOTE: Unstaking Aquari Before November 11th 2024 will result in disqualification from the contest. </p>
          <form
            className="mt-6"
            onSubmit={handleUnstake}>
            <label
              htmlFor="unstake-amount"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Amount to Unstake (Available: {parseFloat(userStakedBalance).toLocaleString()} AQUARI)
            </label>
            <input
              id="unstake-amount"
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              type="text"
              value={unstakeAmount}
              onChange={handleUnstakeChange}
            />
            <button
              className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer"
              type="submit"
              disabled={loading || parseFloat(unstakeAmount) > parseFloat(userStakedBalance)}>
              {loading ? "Unstaking..." : "Unstake AQUARI"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Stake;
