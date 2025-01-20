import React from "react";

import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useLocation, useNavigate } from "react-router-dom";

const WalletOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[999]">
      <div className="flex flex-col items-center justify-center gap-y-4">
        <p className="text-2xl font-bold text-black">
          Please connect your wallet to continue
        </p>
        <WalletMultiButton
          // className="flex justify-center w-full px-4 py-2 text-sm text-white bg-black rounded-lg md:w-40"
          style={{
            backgroundColor: "black",
            padding: "1rem",
            height: "40px",
            // marginTop: "5px",
            fontSize: "15px",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
};

export default WalletOverlay;
