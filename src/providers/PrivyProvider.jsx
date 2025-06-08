"use client";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { base, bsc, mainnet } from "viem/chains";

const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`);
};

function PrivyProviderComponent({ children }) {
  const appId = import.meta.env.VITE_PUBLIC_PRIVY_APP_ID;

  // Check if Privy App ID is configured
  if (!appId || appId === "your_privy_app_id_here") {
    console.error("Privy App ID is not configured. Please set VITE_PUBLIC_PRIVY_APP_ID in your .env file");
    return (
      <div className="flex items-center justify-center min-h-screen bg-primary-bg">
        <div className="max-w-md w-full space-y-8 p-8 text-center">
          <div className="bg-red-900 border border-red-700 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-300 mb-4">Configuration Required</h2>
            <p className="text-red-200 mb-4">Privy App ID is not configured. Please:</p>
            <ol className="text-left text-red-200 text-sm space-y-2">
              <li>
                1. Go to{" "}
                <a
                  href="https://console.privy.io"
                  className="text-blue-400 underline"
                  target="_blank"
                  rel="noopener noreferrer">
                  console.privy.io
                </a>
              </li>
              <li>2. Create a new app or use an existing one</li>
              <li>3. Copy your App ID</li>
              <li>
                4. Update the .env file: <code className="bg-red-800 px-1 rounded">VITE_PUBLIC_PRIVY_APP_ID=your_actual_app_id</code>
              </li>
              <li>5. Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PrivyProvider
      appId={appId}
      onSuccess={handleLogin}
      config={{
        loginMethods: ["wallet", "email", "google", "twitter", "apple", "discord", "github", "sms"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
        appearance: {
          theme: "dark",
          accentColor: "#676FFF",
          logo: "https://s2.coinmarketcap.com/static/img/coins/200x200/9921.png",
        },
        defaultChain: base,
        supportedChains: [mainnet, base],
      }}>
      {children}
    </PrivyProvider>
  );
}

export default PrivyProviderComponent;
