import React, { useContext } from "react";
import { PrivyContext } from "../App.jsx";

const SignIn = ({ setSelected }) => {
  const { login, ready } = useContext(PrivyContext);

  return (
    <div className="flex items-center justify-center min-h-full bg-primary-bg">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Welcome to Public Square</h1>
          <p className="text-text-secondary mb-8">Connect your wallet to join the community discussion</p>

          <div className="space-y-4">
            <button
              onClick={login}
              disabled={!ready}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-purple hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {ready ? "Connect Wallet & Sign In" : "Loading..."}
            </button>

            <div className="text-xs text-text-secondary">
              <p>Powered by Privy</p>
              <p className="mt-2">Supports wallet connections, email, and social login</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-secondary-bg rounded-lg">
          <h3 className="text-lg font-medium text-text-primary mb-3">About Public Square</h3>
          <p className="text-text-secondary text-sm">A decentralized forum platform where community members can engage in meaningful discussions, share ideas, and build connections through blockchain-verified identities.</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
