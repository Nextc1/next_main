import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { useEffect, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  UnsafeBurnerWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "react-hot-toast";

import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Home from "./pages/Home";
import AuthMiddleware from "./components/custom/auth/AuthMiddleware";
import Navbar from "./components/custom/Navbar";
import AboutUs from "./pages/AboutUs";
import AllProperties from "./components/custom/dashboard/pages/AllProperties";
import Launchpad from "./components/custom/dashboard/pages/Launchpad";
import Trade from "./components/custom/dashboard/pages/Trade";
import Portfolio from "./components/custom/dashboard/pages/Portfolio";
import History from "./components/custom/dashboard/pages/History";
import PropertyView from "./pages/PropertyView";
import Dummy from "./pages/admin-only/basic/Dummy";
import CandyMachine from "./pages/admin-only/candy-machine/CandyMachine";
import HowItWorks from "./pages/HowItWorks";
import WalletOverlay from "./components/custom/WalletOverlay";

import { useNavigate } from "react-router-dom";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  useWalletOverlayStore,
  useLoadingStore,
} from "./state-management/store";
import TopBanner from "./components/custom/TopBanner";
import Waitlist from "./pages/Waitlist";
import LoadingOverlay from "./components/custom/LoadingOverlay";

import { usePropertiesStore } from "./state-management/store";
import Sell from "./components/custom/dashboard/pages/Sell";
import Transfer from "./components/custom/dashboard/pages/Transfer";

function App() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;
  const location = useLocation();
  const navigate = useNavigate();
  const { connection } = useConnection();
  // const { publicKey } = useWallet();
  const { showWalletOverlay, setShowWalletOverlay } = useWalletOverlayStore();
  const { isLoading } = useLoadingStore();

  const { fetchProperties } = usePropertiesStore();

  // useEffect(() => {
  //   fetchProperties();
  // }, []);

  // You can also provide a custom RPC endpoint.
  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = useMemo(
  //   () =>
  //     "https://ultra-palpable-orb.solana-mainnet.quiknode.pro/cf7a9deeca1bfe468aacb99226beaa660f6355cb",
  //   []
  // );
  const endpoint = useMemo(
    () =>
      "https://thrumming-broken-road.solana-devnet.quiknode.pro/a8eff2c61a4d11a5090db3642797b2571ba8773c",
    []
  );

  console.log("endpoint", endpoint);

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      // new SolflareWalletAdapter(),
      // new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  useEffect(() => {
    console.log("Backend URL: ", import.meta.env.VITE_BACKEND_URL);
  }, []);

  // useEffect(() => {
  //   console.log("Update in Public Key and Connection: ", publicKey, connection);
  //   if (
  //     location.pathname.includes("/dashboard") &&
  //     (!connection || !publicKey)
  //   ) {
  //     // setShowWalletOverlay(true);
  //     navigate("/");
  //   }
  //   if (connection && publicKey) {
  //     // setShowWalletOverlay(false);
  //     navigate("/dashboard");
  //   }
  // }, [publicKey, connection]);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {location.pathname.includes("/dashboard") ? null : <TopBanner />}

          {
            // Loading overlay
            isLoading ? <LoadingOverlay /> : null
          }
          <Toaster />
          {
            // Wallet overlay modal
            showWalletOverlay ? <WalletOverlay /> : null
          }
          {
            // Navbar component
            location.pathname.includes("/dashboard") ? null : <Navbar />
          }
          <div className="">
            {/* Main content area with padding-top to accommodate the Navbar height */}
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<AboutUs />} />
              {/* <Route path="/dashboard" element={<Dashboard />} /> */}

              {/* Private Route with Guard for Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <AllProperties />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/launchpad"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <Launchpad />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/trade"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <Trade />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/portfolio"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <Portfolio />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/history"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <History />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/sell"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <Sell />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />
              <Route
                path="/dashboard/transfer"
                element={
                  <AuthMiddleware>
                    <Dashboard>
                      <Transfer />
                    </Dashboard>
                  </AuthMiddleware>
                }
              />

              <Route path="/property/view/:id" element={<PropertyView />} />
              <Route path="/dummy" element={<Dummy />} />
              <Route path="/candy-machine" element={<CandyMachine />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/waitlist" element={<Waitlist />} />
            </Routes>
          </div>
          {/* <WalletMultiButton /> */}
          {/* <WalletDisconnectButton /> */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
