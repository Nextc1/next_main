import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faCoins,
  faHouse,
  faListCheck,
  faRightLeft,
  faSeedling,
  faUser,
  faArrowRightArrowLeft,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import { usePropertiesStore } from "../../state-management/store";

const Dashboard: React.FC = ({ children }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<string>("All Properties");
  const {
    fetchProperties,
    properties,
    fetchPriceData,
    fetchSellOrders,
    fetchOnChainMasterEditionData,
    fetchUserProperties,
    fetchUserTxns,
    fetchSellOrdersForAUser,
  } = usePropertiesStore();

  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    // this is for minting programmable NFTs
    .use(mplTokenMetadata());

  useEffect(() => {
    console.log("Properties from state: ", properties);
    fetchProperties();
    fetchPriceData();
    fetchSellOrders();
    fetchUserTxns(umi.identity?.publicKey);
    fetchUserProperties(umi, umi.identity?.publicKey);
    fetchSellOrdersForAUser(umi.identity?.publicKey);
  }, []);

  // useEffect(() => {
  //   if (umi !== undefined || umi !== null) {
  //     if (umi.identity?.publicKey) {
  //       // fetchUserProperties(umi, umi.identity?.publicKey);
  //       fetchUserTxns(umi.identity?.publicKey);
  //     }
  //   }
  // }, [umi]);

  const menuItems = [
    { name: "All Projects", icon: faHouse, path: "/dashboard" },
    {
      name: "Launchpad / Invest",
      icon: faSeedling,
      path: "/dashboard/launchpad",
    },
    { name: "Buy / Trade", icon: faCoins, path: "/dashboard/trade" },
    // { name: "Sell", icon: faHandHoldingDollar, path: "/dashboard/sell" },
    // {
    //   name: "Transfer",
    //   icon: faArrowRightArrowLeft,
    //   path: "/dashboard/transfer",
    // },
  ];

  const accountItems = [
    { name: "Your Portfolio", icon: faChartPie, path: "/dashboard/portfolio" },
    {
      name: "Transaction History",
      icon: faRightLeft,
      path: "/dashboard/history",
    },
    // { name: "Property Management", icon: faListCheck },
    // { name: "Account", icon: faUser },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-[18rem] h-full bg-gray-100 border-r border-gray-200">
        <div className="p-6">
          <h1 className="mt-6 mb-12 text-4xl font-black">Next Carbon</h1>
          <div className="space-y-6">
            <div className="flex flex-col items-start w-full">
              <h2 className="font-semibold text-gray-500 text-md mb-">
                Marketplace
              </h2>
              <div className="py-0 my-0 mb-2 divider"></div>
              <ul className="w-full space-y-2">
                {menuItems.map((item) => (
                  <li
                    key={item.name}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                      activeMenu === item.name
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setActiveMenu(item.name);
                      navigate(item.path);
                    }}
                  >
                    {/* <span>{item.icon}</span> */}
                    <FontAwesomeIcon icon={item.icon} />
                    <span className="text-black">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col items-start w-full pt-4">
              <h2 className="font-semibold text-gray-500 text-md mb-">
                Your Account
              </h2>
              <div className="py-0 my-0 mb-2 divider"></div>
              <ul className="w-full space-y-2">
                {accountItems.map((item) => (
                  <li
                    key={item.name}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer ${
                      activeMenu === item.name
                        ? "bg-gray-200 font-semibold"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setActiveMenu(item.name);
                      navigate(item.path);
                    }}
                  >
                    {/* <span>{item.icon}</span> */}
                    <FontAwesomeIcon icon={item.icon} />
                    <span className="text-black">{item.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Navbar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
          <h2 className="text-2xl text-black">
            {location.pathname.includes("/launchpad")
              ? "Launchpad / Invest"
              : location.pathname.includes("/trade")
              ? "Buy / Trade"
              : location.pathname.includes("/portfolio")
              ? "Your Portfolio"
              : location.pathname.includes("/history")
              ? "Transaction History"
              : location.pathname.includes("/sell")
              ? "Sell"
              : location.pathname.includes("/transfer")
              ? "Transfer"
              : "All Projects"}
          </h2>
          <div className="flex items-center space-x-4">
            <WalletMultiButton
              style={{
                backgroundColor: "black",
                padding: "1rem",
                height: "45px",
                fontSize: "15px",
                borderRadius: "10px",
                width: "150px",
                justifyContent: "center",
              }}
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 py-6 overflow-auto bg-white">{children}</main>
      </div>
    </div>
  );
};

export default Dashboard;
