import React, { useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const { login, ready, authenticated, user } = usePrivy();
  const navigate = useNavigate();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, [authenticated, navigate]);

  return (
    <div className="flex items-center justify-center h-full bg-primary-bg">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-primary">Welcome to Public Square</h2>
          <p className="mt-2 text-text-secondary">Connect with your community</p>
        </div>

        <div className="bg-secondary-bg p-8 rounded-lg shadow-lg border border-border-color">
          {!authenticated ? (
            <div className="space-y-4">
              <p className="text-text-primary text-center">Sign in to join the conversation</p>
              <button
                onClick={login}
                disabled={!ready}
                className="w-full py-3 px-4 bg-accent-purple text-white rounded-md hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {ready ? "Sign In with Privy" : "Loading..."}
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-text-primary">
                Welcome back, <span className="font-semibold text-accent-purple">{user?.wallet?.address ? `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(-4)}` : user?.email?.slice(0, 20) + "..." || "User"}</span>
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                Go to Forum
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
