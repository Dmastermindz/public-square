import React, { useState, useContext, useEffect } from "react";
import { BlockchainContext } from "../pages/home";
import callAquariServer from "../apis/callAquariServer";

const ShieldPayForm = () => {
  const { privySigner, provider, embeddedWalletAddress, linkedWalletAddress, walletBalance, user } = useContext(BlockchainContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const stripPrivyPrefix = (privyId) => {
    return privyId.slice(10, 35);
  };

  const [formData, setFormData] = useState({
    customerId: "", // Will be populated with KYC ID
    firstName: "",
    lastName: "",
    email: "",
    paymentAmount: "",
    sourceCurrency: "EUR",
    sourcePaymentRail: "SEPA Instant",
    cryptocurrency: "USDC",
    blockchain: "Base",
    cryptoAddress: user?.wallet?.address || "",
  });

  // Fetch KYC ID when component mounts
  useEffect(() => {
    const fetchKycId = async () => {
      try {
        if (!user?.id) {
          throw new Error("User not logged in");
        }

        const strippedUserId = stripPrivyPrefix(user.id);
        const response = await callAquariServer.post("/users/get-kyc", {
          user_id: strippedUserId,
        });

        if (response.data.data?.kyc_id) {
          setFormData((prev) => ({
            ...prev,
            customerId: response.data.data.kyc_id,
          }));
        }
      } catch (error) {
        console.error("Error fetching KYC ID:", error);
        setError("Failed to fetch Customer ID: " + (error.response?.data?.message || error.message));
      }
    };

    if (user?.id) {
      fetchKycId();
    }
  }, [user?.id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await callAquariServer.post("/shieldpay", formData);

      console.log("Form submission successful:", response.data);
      setSuccess("Form submitted successfully!");
      // Optionally, clear the form here
      // setFormData({ firstName: "", lastName: "", ... });
    } catch (error) {
      console.error("Form submission failed:", error);
      setError(error.response?.data?.message || error.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#000000] overflow-y-auto bg-opacity-40 h-full full-height rounded-2xl rounded-b-none rounded-r-none py-8 px-5 md:px-4">
      <div className="md:mx-auto lg:w-4/6 2xl:w-4/6">
        <h1 className="text-3xl mt-3 md:mt-4 lg:mt-4 font-semibold tracking-wider text-white">ShieldPay Form</h1>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {success && <p className="text-green-500 mt-2">{success}</p>}
        <form
          className="mt-6"
          onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="customerId"
              className="block mb-2 text-sm font-medium text-white">
              Customer ID
            </label>
            <input
              type="text"
              id="customerId"
              name="customerId"
              value={formData.customerId}
              readOnly
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-white">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-white">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="paymentAmount"
              className="block mb-2 text-sm font-medium text-white">
              Payment Amount (Euro)
            </label>
            <input
              type="text"
              id="paymentAmount"
              name="paymentAmount"
              value={formData.paymentAmount}
              onChange={handleChange}
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="cryptoAddress"
              className="block mb-2 text-sm font-medium text-white">
              Crypto Address
            </label>
            <input
              type="text"
              id="cryptoAddress"
              name="cryptoAddress"
              value={formData.cryptoAddress}
              readOnly
              className="bg-gray-50 focus:outline-none border opacity-[60%] border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer text-white w-full">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShieldPayForm;
