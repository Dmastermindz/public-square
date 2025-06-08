"use client";
// Pressing Control+ Space when typing out component IE PrivyProvider will bring up menu showing all parameters we can pass. REMEBER THIS IT MAKES PROGRAMMING EASY LIKE ROBLOX
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { base, bsc, mainnet } from "viem/chains";

const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`);
};

function PrivyProviderB({ children }) {
  return (
    <PrivyProvider
      appId={import.meta.env.VITE_PUBLIC_PRIVY_APP_ID}
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

export default PrivyProviderB;
