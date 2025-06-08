import React from "react";

const Navbar = ({ selected, setSelected, authenticated, login, logout, ready, embeddedWallet, linkedWallet }) => {
  return (
    <nav className="bg-secondary-bg border-b border-border-color p-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-text-primary">Public Square</h1>
      </div>

      <div className="flex items-center space-x-4">
        {authenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary text-sm">
              {embeddedWallet?.address?.slice(0, 6)}...{embeddedWallet?.address?.slice(-4)} ||
              {linkedWallet?.address?.slice(0, 6)}...{linkedWallet?.address?.slice(-4)}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={login}
            disabled={!ready}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50">
            {ready ? "Sign In" : "Loading..."}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
