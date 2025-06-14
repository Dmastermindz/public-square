import React from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate, useLocation } from "react-router-dom";
import { MessageCircle, Wallet, LogOut } from "lucide-react";

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
    <div className="flex h-[70px] py-2.5 justify-between items-center bg-gradient-to-r from-[#264EA4] via-[#4158ED] via-[#297FE8] via-[#2246BC] to-[#181862] rounded-b-3xl border-x border-b border-[#44DFE9] fixed top-0 left-[1%] right-[1%] z-[100]">
      <div className="flex flex-1 justify-between items-center px-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="relative w-[30px] h-[32px]">
            <div className="absolute w-5 h-5 border-2 border-white left-[5px] top-1.5"></div>
            <div className="absolute w-5 h-5 border-2 border-white left-2.5 top-3"></div>
            <div className="absolute w-5 h-5 border-2 border-white left-2.5 top-0"></div>
            <div className="absolute w-5 h-5 border-2 border-white left-0 top-2"></div>
          </div>

          {/* Brand and Navigation */}
          <div className="flex items-center gap-6">
            <h1
              onClick={() => navigate("/")}
              className="text-[24px] font-bold leading-[22px] bg-gradient-to-r from-[#CF57DC] to-[#83BCF3] bg-clip-text text-transparent h-auto self-center cursor-pointer"
              style={{
                fontFamily: "Space Grotesk, sans-serif",
              }}>
              Public.Square
            </h1>

            <div className="flex items-center gap-2">
              {/* Message Icon */}
              <div className="flex w-[32px] h-[32px] p-2 justify-center items-center gap-2 rounded-xl border border-white bg-[#FF26DC] shadow-[0px_1px_10.4px_0px_rgba(46,44,166,0.40)] cursor-pointer hover:bg-[#FF26DC]/90 transition-colors">
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-white" />
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#FFDB1E] rounded-full"></div>
                </div>
              </div>

              {/* Wallet Icon */}
              <div className="flex w-[32px] h-[32px] p-2 justify-center items-center gap-2 rounded-xl border border-white bg-[#27BBFB] shadow-[0px_1px_10.4px_0px_rgba(46,44,166,0.40)] cursor-pointer hover:bg-[#27BBFB]/90 transition-colors">
                <Wallet className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Button */}
      <div className="flex items-center space-x-4 pr-8">
        {authenticated ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 rounded-lg border-2 border-white text-white text-sm font-medium">
              <Wallet className="w-4 h-4" />
              <span style={{ fontFamily: "DM Sans, sans-serif" }}>{user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : user?.email?.slice(0, 10) + "..." || "User"}</span>
            </div>
            <button
              onClick={logout}
              className="h-[42px] px-4 py-2 gap-1 rounded-lg border-2 border-white bg-transparent hover:bg-white/10 text-white text-sm font-medium flex items-center"
              style={{ fontFamily: "DM Sans, sans-serif" }}>
              <LogOut className="w-4 h-4 mr-1" />
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            disabled={!ready}
            className={`h-[58px] px-8 py-3 gap-2 rounded-lg border-2 border-white shadow-[0px_4px_0px_0px_#000] hover:shadow-[0px_2px_0px_0px_#000] hover:translate-y-0.5 transition-all text-white text-lg font-medium ${!ready ? "opacity-50" : "bg-gradient-to-r from-purple-600 to-blue-500"}`}
            style={{ fontFamily: "DM Sans, sans-serif" }}>
            {ready ? "Connect Wallet" : "Loading..."}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
