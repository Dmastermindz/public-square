import React, { useState, useEffect, useContext } from "react";
import CallAquariServer from "../apis/callAquariServer";
import { BlockchainContext } from "../pages/home";

const NewInviteOverlay = ({ isOpen, setIsOpen }) => {
  const { user, setSelected, activeCategoryId } = useContext(BlockchainContext); // Blockchain Context has Blockchain Data but we will keep threadID there too
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  //console.log("Privy User ID:", user.id.slice(10));

  const isValidEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  };

  //API Call to backend to Create a new Topic
  const addInvite = async () => {
    try {
      if (isValidEmail(email)) {
        const response = await CallAquariServer.post("/operations/invite", {
          inviter_user_id: user.id.slice(10),
          invitee_email: email,
        });

        if (response.data.status === "success") {
          console.log("Server Resposne (invite):", response);
        }

        // Reset form fields
        setEmail("");
        setSuccessMessage("Success: Your friend has been Invited to Aquari. You may now check the leaderboard perodically each day to keep track of your contest position & score!");
        setErrorMessage("");
      } else {
        console.log("Input was not a Valid Email Address");
        setErrorMessage("Error: The input you provided was not a valid E-mail address. Please enter a valid E-mail Address.");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error Inviting Friend:", error);
      setErrorMessage("Error: This email has already been invited. Please try to invite another user.");
      setSuccessMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addInvite();
    // Handle form submission, e.g., send data to server
    console.log("Dialog Window Open?", isOpen);
    console.log("Invited Email:", email);
  };

  if (!isOpen) {
    return null;
  } // Don't render if the overlay is not open
  else
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-[#090d18] shadowzx w-[800px] h-[100svh] lg:h-[28svh] p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Invite a friend to Aquari for a chance to win $AQUARI.</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-red-700 mb-2">{errorMessage ? errorMessage : null}</p>
              <p className="text-green-700 mb-2">{successMessage ? successMessage : null}</p>
              <label
                htmlFor="email"
                className="block text-white mb-2">
                Email Address
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-[#a8b1ff] bg-opacity-20 text-white"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                }}
                className="px-4 py-2 mr-2 rounded-md bg-gray-500 text-white">
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-green-600 text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default NewInviteOverlay;
