import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { authenticated, login, logout, ready, user } = usePrivy();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = () => {
    if (location.pathname !== "/signin") {
      navigate("/signin");
    } else {
      login();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-secondary-bg border-b border-border-color p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-text-primary cursor-pointer hover:text-accent-purple transition-colors">
          Public Square
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {authenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary text-sm">{user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : user?.email?.slice(0, 10) + "..." || "User"}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={!ready}
            className="px-4 py-2 bg-accent-purple text-white rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50">
            {ready ? "Sign In" : "Loading..."}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
