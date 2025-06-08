import React, { useState, useContext } from "react";
import "@onefootprint/footprint-js/dist/footprint-js.css";
import footprint from "@onefootprint/footprint-js";
import { BlockchainContext } from "../pages/home";
import callAquariServer from "../apis/callAquariServer";

const FootprintLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { privySigner, user } = useContext(BlockchainContext);

  const stripPrivyPrefix = (privyId) => {
    return privyId.slice(10, 35);
  };

  const updateUserKycId = async (kycId) => {
    try {
      const strippedUserId = stripPrivyPrefix(user.id);
      if (!strippedUserId) {
        throw new Error("Invalid user ID");
      }

      console.log("RAW KYC ID before update:", kycId);

      const response = await callAquariServer.post("/users/kyc", {
        user_id: strippedUserId,
        kyc_id: kycId,
      });

      console.log("KYC ID updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating KYC ID:", error);
      throw error;
    }
  };

  const submitValidationToken = async (validationToken) => {
    try {
      setLoading(true);
      setError(null);

      if (!user.id) {
        throw new Error("User not logged in");
      }

      console.log("Sending validation token:", validationToken);

      const response = await callAquariServer.post("/shield/validate", {
        validationToken,
      });

      console.log("Shield validation response:", response.data);

      // Changed from customerId to id to match Shield's response structure
      const shieldId = response.data.id;

      console.log("Received Shield ID:", shieldId);

      if (!shieldId) {
        throw new Error("No ID received from Shield");
      }

      // Update the user's KYC ID in your database
      await updateUserKycId(shieldId);

      setSuccess("KYC verification completed successfully!");
      console.log("Validation Token Successfully Submitted to Shield");

      return shieldId;
    } catch (error) {
      console.error("Error during Shield validation:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "Failed to complete KYC verification. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!user.id) {
      setError("Please log in first");
      return;
    }

    const component = footprint.init({
      kind: "verify",
      publicKey: "pb_live_8SuCeEXJ99TgiACYstFqPI", //US Playbook pb_live_hVeS1gi6qUGNRjnu78sm80   //International Playbook: pb_live_8SuCeEXJ99TgiACYstFqPI
      bootstrapData: {},
      onComplete: async (validationToken) => {
        console.log("Validation token received from Footprint:", validationToken);
        try {
          await submitValidationToken(validationToken);
        } catch (error) {
          console.error("Failed to process validation token:", error);
        }
      },
    });
    component.render();
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}
      <button
        onClick={handleClick}
        disabled={loading || !user.id}
        className="bg-[#232734] bg-opacity-90 mt-2 hover:bg-[#34394d] p-[9px] rounded-md transition duration-300 ease-in-out cursor-pointer text-white">
        {loading ? "Processing..." : "Start KYC"}
      </button>
    </div>
  );
};

export default FootprintLogin;
