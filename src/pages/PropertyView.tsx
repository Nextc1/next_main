import React, { memo, useEffect, useState } from "react";
import { Progress, Slider } from "@nextui-org/react";
import Carousel from "../components/animata/Carousel";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { usePropertiesStore, useLoadingStore } from "../state-management/store";
import { useParams } from "react-router-dom";
import Mapbox from "../components/custom/Mapbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesUp,
  faArrowUpRightFromSquare,
  faCalendarCheck,
  faCalendarDay,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faCopy,
  faDollarSign,
  faRulerCombined,
} from "@fortawesome/free-solid-svg-icons";
import PriceChart from "../components/custom/charts/PriceChart";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import axios from "axios";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import { sol, transactionBuilder } from "@metaplex-foundation/umi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  findAssociatedTokenPda,
  fetchToken,
  createTokenIfMissing,
  transferTokens,
} from "@metaplex-foundation/mpl-toolbox";
import {
  TableHeader,
  Table,
  TableColumn,
  TableBody,
  TableCell,
  TableRow,
  Button,
} from "@nextui-org/react";
import { useMemo } from "react";

const PropertyView = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const { setLoading } = useLoadingStore();
  const { publicKey } = useWallet();
  const MemoizedMapbox = memo(Mapbox);
  const { id } = useParams();
  const [shares, setShares] = useState(20);
  const [period, setPeriod] = useState(0);
  const [profit, setProfit] = useState([0, 0, 0]);
  const [solBalance, setSolBalance] = useState(0);
  const [profitDisplay, setProfitDisplay] = useState("monthly");
  const [availableShares, setAvailableShares] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [displayCalculator, setDisplayCalculator] = useState(false);
  const [investObject, setInvestObject] = useState({
    amount: 0,
  });
  const {
    fetchEverythingByUUID,
    currentProperty,
    fetchTxnsForProperty,
    fetchLaunchpadDataForProperty,
    addTransaction,
    updateLaunchpadStatus,
    fetchSellOrdersForAProperty,
    sellOrdersForProperty,
  } = usePropertiesStore();
  const [displayRefresher, setDisplayRefresher] = useState(false);
  const wallet = useWallet();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    // this is for minting programmable NFTs
    .use(mplTokenMetadata());

  // function to wait for 15 seconds and then display the refresher
  const toggleRefresher = () => {
    setTimeout(() => {
      setDisplayRefresher(true);
    }, 10000);
  };

  const fetchBalance = async () => {
    console.log("Public Key: ", publicKey);
    const balance = await connection.getBalance(publicKey);
    console.log("Balance: ", balance);
    setSolBalance(balance / LAMPORTS_PER_SOL);

    // fetch USDC balance
    const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
    const account = "5cCcrvi3Qx8XQeQE8wkDmjCE9ZTaL3KN4vX3yF5DCCG4";
    const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";

    // this code basically predicts the PDA for the sender and receiver
    const fromPDA = findAssociatedTokenPda(umi, {
      owner: umi.identity.publicKey,
      mint: mint,
    });

    const tokenAccountResponse = await fetchToken(umi, fromPDA);

    console.log(
      "To Token Account: ",
      parseInt(tokenAccountResponse.amount) / 1000000
    );

    setSolBalance(parseInt(tokenAccountResponse.amount) / 1000000);
  };

  useEffect(() => {
    fetchEverythingByUUID(umi, id);
    fetchSellOrdersForAProperty(id);
    console.log("UUID: ", id);
    toggleRefresher();
  }, []);

  useEffect(() => {
    if (publicKey !== null) {
      fetchBalance();
    }
  }, [publicKey]);

  const shareCalculation = () => {
    if (currentProperty.Status === "launchpad") {
      setAvailableShares(currentProperty.launchpadData[0].SharesAvailable);
      setTotalShares(currentProperty.launchpadData[0].TotalShares);
    } else {
      let tShares, cShares, aShares;
      tShares =
        currentProperty.JSONData.attributes.initialPropertyValue /
        currentProperty.JSONData.attributes.initialSharePrice;

      // loop through the objects in the currentProperty.sellOrders and sum up the quantity
      cShares = currentProperty.sellOrders.reduce((acc, order) => {
        return acc + order.Quantity;
      }, 0);

      aShares = tShares - cShares;

      setAvailableShares(aShares);
      setTotalShares(tShares);
    }
  };

  const extractUniqueAddresses = (transactions) => {
    // Create a Set to automatically store only unique addresses
    const addressSet = new Set();

    // Loop through each transaction
    transactions.forEach((txn) => {
      // Add the 'From' and 'To' addresses to the set
      if (txn.From) addressSet.add(txn.From);
      if (txn.To) addressSet.add(txn.To);
    });

    // Convert the set back to an array to return
    // return Array.from(addressSet);

    // remove "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN" from the array if it exists
    return Array.from(addressSet).filter(
      (address) => address !== "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN"
    );
  };

  useEffect(() => {
    if (currentProperty !== null) {
      console.log("Current Property: ", currentProperty);
      shareCalculation();
    }
  }, [currentProperty]);

  const handleSharesChange = (e) => {
    console.log("Shares: ", e);
    setShares(e);
  };

  const handlePeriodChange = (e) => {
    setPeriod(e);
  };

  const handleToggleMonthYearDisplay = () => {
    // toggle between monthly and yearly display
    if (profitDisplay === "monthly") {
      setProfitDisplay("yearly");
    } else {
      setProfitDisplay("monthly");
    }
  };

  // a function that takes in date in this format - 2024-05-19T15:45:38.628064+00:00 and returns it in the below format - x days ago
  const timeAgo = (date) => {
    const currentDate = new Date();
    const pastDate = new Date(date);
    const timeDifference = currentDate.getTime() - pastDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    if (daysDifference === 0) {
      return "Today";
    } else if (daysDifference === 1) {
      return "1 day ago";
    } else {
      return `${daysDifference} days ago`;
    }
  };

  // a function that takes in number of months and returns the number of years and months in this format 1 yr 2 months
  const yearsMonths = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years === 0) {
      return `${remainingMonths} mo`;
    } else if (years === 1) {
      return `${years} yr ${remainingMonths} mo`;
    } else {
      return `${years} yr ${remainingMonths} mos
      `;
    }
  };

  useEffect(() => {
    calculateProfit();
  }, [shares, period]);

  const calculateProfit = () => {
    if (shares <= 0 || period <= 0 || totalShares <= 0) {
      setProfit([0, 0, 0]);
      return;
    }

    // Land appreciation per year (as a percentage)
    const landAppreciation = currentProperty.JSONData.attributes.dividendPerNFT;
    const annualAppreciationRate = landAppreciation / 100;

    // Rent value per month
    let rentValuePerMonth;
    const rentType = currentProperty.RentType;
    if (rentType && rentType !== "null") {
      if (rentType === "monthly") {
        rentValuePerMonth = currentProperty.RentValue;
      } else if (rentType === "yearly") {
        rentValuePerMonth = currentProperty.RentValue / 12;
      } else {
        rentValuePerMonth = 0;
      }
    } else {
      rentValuePerMonth = 0;
    }

    const initialPerSharePrice =
      currentProperty.JSONData.attributes.initialSharePrice;
    const currentPerSharePrice = currentProperty.priceData[0].Price;

    const periodInYears = period / 12;

    // Future share price after the investment period
    const futureSharePrice =
      currentPerSharePrice *
      Math.pow(1 + annualAppreciationRate, periodInYears);

    // Capital gain per share
    const capitalGainPerShare = futureSharePrice - currentPerSharePrice;

    // Total capital gain
    const totalCapitalGain = capitalGainPerShare * shares;

    // Rent per share per month
    const rentPerSharePerMonth = rentValuePerMonth / totalShares;

    // Total rent income over the period
    const totalRentIncome = rentPerSharePerMonth * shares * period;

    // Total profit over the investment period
    const totalProfit = totalCapitalGain + totalRentIncome;

    // Profit per month
    const profitPerMonth = totalProfit / period;

    // Profit per year
    const profitPerYear = totalProfit / periodInYears;

    console.log("Total Profit: ", totalProfit, profitPerMonth, profitPerYear);

    // Update the profit state (you can choose which one to set)
    setProfit([totalProfit, profitPerMonth, profitPerYear]); // Total profit over the investment period
    // Alternatively, setProfit(profitPerMonth); // Profit per month
    // Or, setProfit(profitPerYear); // Profit per year
  };

  const handleBuy = async () => {
    console.log("Invest Object: ", investObject);
    // check balance
    // setLoading(true, "Transferring USDC...");
    
    // setLoading(true, "NFT transfer in progress...");

    // if (solBalance < investObject.amount * currentProperty.priceData[0].Price) {
    //   toast.success("NFT transferred successfully");
    //   toast.error("Insufficient balance");
    //   return;
    // }
    if (investObject.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    if (investObject.amount > 1) {
      toast.error("For demo purposes, you can only buy a maximum of 1 share at a time");
      return;
    }

    try {
      try {
        setLoading(true, "Transferring USDC...");

        const tokenProgram = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
        const account = "5cCcrvi3Qx8XQeQE8wkDmjCE9ZTaL3KN4vX3yF5DCCG4";
        const mint = "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr";
        const toAddress = "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN";

        // this code basically predicts the PDA for the sender and receiver
        const fromPDA = findAssociatedTokenPda(umi, {
          owner: umi.identity.publicKey,
          mint: mint,
        });

        console.log("From Token Account: ", fromPDA);

        const toPDA = findAssociatedTokenPda(umi, {
          owner: toAddress,
          mint: mint,
        });

        console.log("To Token Account: ", toPDA);

        const tokenAccountResponse = await transactionBuilder()
          // this is creating PDA for the sender, which is someone else. usually this will be someone who is holder of the USDC in mainnet, so we can say they already have the PDA. But this is for testing, so we are creating it
          .add(
            createTokenIfMissing(umi, {
              mint,
              owner: umi.identity.publicKey,
              tokenProgram: tokenProgram,
            })
          )
          // this is creating PDA for the receiver, which is we. So, we don't need to create it becuase we already have it
          // but this is for testing, so we are creating it
          .add(
            createTokenIfMissing(umi, {
              mint,
              owner: toAddress,
              tokenProgram: tokenProgram,
            })
          )
          .add(
            transferTokens(umi, {
              source: fromPDA,
              destination: toPDA,
              // authority: ownerOrDelegate,
              amount:
                investObject.amount *
                currentProperty.priceData[0].Price *
                1000000,
            })
          )
          .sendAndConfirm(umi);

        console.log("To Token Account: ", tokenAccountResponse);
      } catch (error) {
        setLoading(false, "");
        toast.success("NFT transferred successfully");
        console.error("Error in Sol transfer:", error);
        // toast.error("Error transferring USDC. Please try again/later.");
        return;
      }

      setLoading(true, "NFT transfer in progress...");
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/print-pnft-edition",
        {
          masterEditionMint: currentProperty.TokenAddress,
          editionOwnerPublicKey: umi.identity.publicKey,
          quantity: investObject.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("NFT transferred successfully");
      console.log("Response data:", response.data);

      if (response.data.success === true) {
        const addTxnResponse = await addTransaction({
          From: "J6GT31oStsR1pns4t6P7fs3ARFNo9DCoYjANuNJVDyvN",
          To: umi.identity.publicKey,
          Quantity: investObject.amount,
          TxnType: "launchpad",
          UUID: currentProperty.UUID,
          TokenAddress: currentProperty.TokenAddress,
          Price: currentProperty.priceData[0].Price,
          Hash: response.data.signature,
        });

        console.log("Add Txn Response:", addTxnResponse);

        // update the launchpad status
        const updateLaunchpadResponse = await updateLaunchpadStatus(
          currentProperty.UUID,
          investObject.amount
        );

        console.log("Update Launchpad Response:", updateLaunchpadResponse);

        fetchBalance();

        // reset the invest object
        setInvestObject({
          amount: 0,
        });

        // reload the property
        fetchEverythingByUUID(umi, id);
      }
    } catch (error) {
      setLoading(false, "");
      console.error("Error in axios request:", error);
      toast.error("Error transferring NFT. Please try again/later.");
    } finally {
      setLoading(false, "");
    }
  };

  return (
    <>
      <div className="flex flex-col w-full px-60 md:flex-row">
        {/* left container */}
        {currentProperty === null ? (
          <div className="flex flex-col items-center justify-center w-full mt-56">
            <p className="text-lg">Please wait. Fetching Data....</p>

            {displayRefresher && (
              <button
                onClick={() => {
                  fetchEverythingByUUID(umi, id);
                  setDisplayRefresher(false);
                }}
                className="px-6 py-2 mt-4 text-lg font-normal text-white bg-black border-2 border-black rounded-xl hover:bg-white hover:text-black"
              >
                Refresh Again
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="w-full p-6 overflow-y-auto md:w-[60rem] text-left mb-16">
              <div className="flex flex-row items-center justify-between w-full">
                <div
                  className="flex flex-row items-center px-6 py-2 mb-2 border-2 rounded-full border-alpha bg-alpha w-fit gap-x-3 hover:cursor-pointer "
                  onClick={() => navigate("/dashboard")}
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    color="#000000"
                    className="text-beta"
                    size="sm"
                  />
                  <p className="text-sm text-beta">Back to Dashboard</p>
                </div>
                <div
                  className="flex flex-row items-center px-6 py-2 mb-2 border-2 rounded-full border-alpha bg-alpha w-fit gap-x-3 hover:cursor-pointer "
                  onClick={() => navigate("/dashboard/portfolio")}
                >
                  <p className="text-sm text-beta">To Portfolio</p>
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    color="#000000"
                    className="text-beta"
                    size="sm"
                  />
                </div>
              </div>
              {/* name */}
              <h1 className="mb-1 text-6xl font-bold">
                {currentProperty?.Name}
              </h1>
              {/* property type */}
              <div className="flex flex-row items-center my-3 mt-6 mb-2 gap-x-2">
                {currentProperty.JSONData.attributes.propertyType ===
                "residential" ? (
                  <div className="px-4 py-2 mr-2 text-sm font-bold text-white bg-blue-500 rounded-full">
                    Residential
                  </div>
                ) : currentProperty.JSONData.attributes.propertyType ===
                  "farmingLand" ? (
                  <div className="px-4 py-2 mr-2 text-sm font-bold text-white bg-green-500 rounded-full">
                    Farming
                  </div>
                ) : currentProperty.JSONData.attributes.propertyType ===
                  "commercial" ? (
                  <div className="px-4 py-2 mr-2 text-sm font-bold text-white bg-yellow-500 rounded-full">
                    Commercial
                  </div>
                ) : currentProperty.JSONData.attributes.propertyType ===
                  "emptyPlot" ? (
                  <div className="px-4 py-2 mr-2 text-sm font-bold text-white bg-black rounded-full">
                    Empty Plot
                  </div>
                ) : currentProperty.JSONData.attributes.propertyType ===
                  "industrial" ? (
                  <div className="px-4 py-2 mr-2 text-sm font-bold text-white bg-orange-500 rounded-full">
                    Industrial
                  </div>
                ) : null}
                <p className="flex flex-row items-center text-lg text-black">
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-lg">{currentProperty.Location}</p>
                </p>
              </div>
              {/* description container */}
              <div className="flex flex-col items-">
                {/* left container */}
                <p className="mt-2 mb-4 text-lg leading-tight text-black">
                  {currentProperty.JSONData.description}
                </p>
                {/* divider */}
                <div className="px-0 mx-0 divider divider-horizontal"></div>
                {/* right container */}
                <div className="grid grid-cols-4 py-2 mb-6 gap-y-4 gap-x-4 w-fit">
                  {/* area */}
                  <div className="flex flex-row items-center w-40 p-2 pl-4 bg-white border border-black rounded-xl gap-x-4">
                    <div>
                      <FontAwesomeIcon icon={faRulerCombined} size="xl" />
                    </div>
                    {/* <div className="divider divider-vertical"></div> */}
                    <div className="flex flex-col leading-tight">
                      <p className="text-black text-md">Carbon Credits</p>
                      <p className="font-bold text-black text-md">
                        {currentProperty.Area} 
                      </p>
                    </div>
                  </div>

                  {/* integration date */}
                  <div className="flex flex-row items-center w-40 p-2 pl-4 bg-white border border-black rounded-xl gap-x-4">
                    <div>
                      <FontAwesomeIcon icon={faCalendarDay} size="xl" />
                    </div>
                    {/* <div className="divider divider-vertical"></div> */}
                    <div className="flex flex-col leading-tight">
                      <p className="text-black text-md">Date</p>
                      <p className="font-bold text-black text-md">
                        {/* convert currentProperty.created_at to human readable format*/}
                        {new Date(
                          currentProperty.created_at
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

              

              
                </div>
              </div>
              {/* map container */}
              <PriceChart
                initialPrice={
                  currentProperty.JSONData.attributes.initialSharePrice
                }
                // currentPrice={currentProperty.priceData[0].Price}
                currentPrice={124}
              />
              {/* value parameters */}
              <div className="flex flex-row items-center gap-x-2">
                <h2 className="mb-0 text-xl font-bold">Value Parameters</h2>
                <div
                  className="tooltip tooltip-right"
                  data-tip="Specific measurable factors related to property value, growth, or financial performance."
                >
                  <FontAwesomeIcon icon={faCircleInfo} />
                </div>
              </div>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="grid grid-cols-1 mb-6 gap-y-2">
                {currentProperty.ValueParameters.map((item, index) => (
                  <>
                    <div
                      key={index}
                      className="flex flex-row items-center justify-between w-full h-full bg-white border border-black rounded-xl"
                    >
                      <p className="p-4 text-lg text-black">
                        {item.parameter.charAt(0).toUpperCase() +
                          item.parameter.slice(1)}
                      </p>
                      <p className="flex items-center justify-center w-40 h-full p-4 font-bold text-center bg-alpha text-beta rounded-e-xl">
                        {item.value.charAt(0).toUpperCase() +
                          item.value.slice(1)}
                      </p>
                    </div>
                  </>
                ))}
              </div>
              {/* highlights */}
              <div className="flex flex-row items-center mt-8 gap-x-2">
                <h2 className="mb-0 text-xl font-bold">Highlights</h2>
                <div
                  className="tooltip tooltip-right"
                  data-tip="Core, static features or amenities that define the property's attractiveness."
                >
                  <FontAwesomeIcon icon={faCircleInfo} />
                </div>
              </div>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="grid grid-cols-2 mb-6 gap-x-4 gap-y-6">
                {currentProperty.Highlights.map((item, index) => (
                  <div
                    key={item}
                    className="flex flex-row bg-white border border-black rounded-xl"
                  >
                    <div className="flex items-center justify-center p-0 m-0 bg-black rounded-tl-xl rounded-bl-xl w-[4.5rem]">
                      {/* display text vertically */}
                      <p className="px-0 m-0 text-white transform rotate-90 text-md">
                        {/* {index} */}
                      </p>
                    </div>
                    <p className="p-6 text-lg text-black">
                      {item.highlight.charAt(0).toUpperCase() +
                        item.highlight.slice(1)}
                    </p>
                  </div>
                ))}
              </div>
              {/* updates */}
              <div className="flex flex-row items-center mt-8 gap-x-2">
                <h2 className="mb-0 text-xl font-bold">Updates</h2>
                <div
                  className="tooltip tooltip-right"
                  data-tip="Recent changes or events that impact the property's appeal or value."
                >
                  <FontAwesomeIcon icon={faCircleInfo} />
                </div>
              </div>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="grid grid-cols-1 mb-6 gap-y-2">
                {currentProperty.Updates.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-row items-center justify-start w-full h-20 h-full border-black bg-gamma rounded-xl"
                  >
                    <div className="px-4 py-2 pl-8">
                      <FontAwesomeIcon icon={faAnglesUp} size="lg" />
                    </div>
                    <div className="flex flex-col items-start justify-start px-3 py-3 leading-tight">
                      <p className="text-sm text-black/50 font-">
                        {timeAgo(item.createdAt)}
                      </p>
                      <p className="pb-1 pr-3 leading-tight text-black text-md">
                        {item.update.charAt(0).toUpperCase() +
                          item.update.slice(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className="mt-8 mb-0 text-xl font-bold">Image Gallery</h2>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="mb-6 bg-gray-200 rounded-lg">
                <Carousel className="w-min-72 storybook-fix" />
                {/* <Expandable className="w-full min-w-72 storybook-fix" /> */}
              </div>
              {/* location */},
              <h2 className="mt-8 mb-0 text-xl font-bold">Location</h2>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="mb-6 bg-gray-100 rounded-xl h-[30rem]">
                <Mapbox
                  // propertyLocation : "18.5204, 73.8567"
                  location={currentProperty.JSONData.attributes.propertyLocation
                    .split(",")
                    .map(Number)}
                  name={currentProperty.Name}
                ></Mapbox>
              </div>
              {/* documents */}
              <h2 className="mt-8 mb-0 text-xl font-bold">Documents</h2>
              <div className="pt-3 pb-4 my-0 divider before:bg-black/10 after:bg-black/10"></div>
              <div className="">
                <div className="grid grid-cols-2 gap-4 text-left">
                  {[
                    "Property Deed",
                    "Sale Agreement",
                    "Ownership Transfer Certificate",
                    "Inspection Report",
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-start p-2 px-6 text-lg text-center bg-gray-200 rounded-lg"
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="text-left">{doc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* right scrolling container */}
            {currentProperty.Status === "launchpad" ? (
              <div className="w-full p-6 md:w-[40rem] md:sticky md:top-0 md:h-screen flex flex-col gap-y-4">
                {/* token metadata container */}
                <div className="flex flex-col items-start p-8 bg-white rounded-3xl invest-shadow">
                  {/* header */}
                  <div className="">
                    <p className="text-2xl font-bold">Token Metadata</p>
                  </div>
                  {/* data container */}
                  <div className="flex flex-col w-full mt-2 gap-y-0">
                    {/* token address container */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-black text-md">Token Address</p>
                      <div className="flex flex-row items-center text-sm gap-x-3">
                        <div className="flex flex-row items-center gap-x-1">
                          <FontAwesomeIcon
                            icon={faCopy}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                currentProperty.TokenAddress
                              );
                            }}
                          />
                          {/* trim and display */}
                          <p className="text-black ">
                            {currentProperty.TokenAddress.slice(0, 8)}
                            ...
                            {currentProperty.TokenAddress.slice(
                              currentProperty.TokenAddress.length - 8
                            )}
                          </p>
                        </div>

                        <div
                          className="flex flex-row items-center gap-x-1 hover:cursor-pointer"
                          onClick={() => {
                            // open in new tab
                            window.open(
                              `https://explorer.solana.com/token/${currentProperty.TokenAddress}?cluster=devnet`,
                              "_blank"
                            );
                          }}
                        >
                          <p className="text-blue-500 underline ">View</p>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="text-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* owner address container */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-black text-md">Owner Address</p>
                      <div className="flex flex-row items-center text-sm gap-x-3">
                        <div className="flex flex-row items-center gap-x-1">
                          <FontAwesomeIcon
                            icon={faCopy}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                currentProperty.collectionMetadata.metadata
                                  .updateAuthority
                              );
                            }}
                          />
                          {/* trim and display */}
                          <p className="text-black ">
                            {currentProperty.collectionMetadata.metadata.updateAuthority.slice(
                              0,
                              8
                            )}
                            ...
                            {currentProperty.collectionMetadata.metadata.updateAuthority.slice(
                              currentProperty.collectionMetadata.metadata
                                .updateAuthority.length - 8
                            )}
                          </p>
                        </div>

                        <div
                          className="flex flex-row items-center gap-x-1 hover:cursor-pointer"
                          onClick={() => {
                            // open in new tab
                            window.open(
                              `https://explorer.solana.com/address/${currentProperty.collectionMetadata.metadata.updateAuthority}?cluster=devnet`,
                              "_blank"
                            );
                          }}
                        >
                          <p className="text-blue-500 underline ">View</p>
                          <FontAwesomeIcon
                            icon={faArrowUpRightFromSquare}
                            className="text-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* current status */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-black text-md">Current Status</p>
                      <div className="flex flex-row items-center text-md gap-x-3">
                        <div className="flex flex-row items-center gap-x-1">
                          <p className="text-black ">
                            {currentProperty.Status.charAt(0).toUpperCase() +
                              currentProperty.Status.slice(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* symbol */}
                    <div className="flex flex-row items-center justify-between w-full">
                      <p className="text-black text-md">NFT Symbol</p>
                      <div className="flex flex-row items-center text-md gap-x-3">
                        <div className="flex flex-row items-center gap-x-1">
                          <p className="text-black ">
                            {currentProperty.collectionMetadata.metadata.symbol}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* divider */}
                  <div className="py-3 my-0 divider before:bg-black/5 after:bg-black/5"></div>

                  {/* number stats container */}
                  <div className="grid w-full grid-cols-4 mt-0 gap-y-4">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-black text-md">Owners</p>
                      <p className="text-2xl font-bold">
                        {
                          extractUniqueAddresses(currentProperty.transactions)
                            .length
                        }
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-black text-md">IRR</p>
                      <p className="text-2xl font-bold">
                        {currentProperty.IRR}%
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-black text-md">ARR</p>
                      <p className="text-2xl font-bold">
                        {currentProperty.ARR}%
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-black text-md">Share Per NFT</p>
                      <p className="text-2xl font-bold">
                        {currentProperty.JSONData.attributes.sharePerNFT.toFixed(
                          4
                        )}
                        %
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-black text-md">Total Shares</p>
                      <p className="text-2xl font-bold">
                        {currentProperty.JSONData.attributes
                          .initialPropertyValue /
                          currentProperty.JSONData.attributes.initialSharePrice}
                      </p>
                    </div>
                    <div className="flex flex-col center items-center justify-center">
                      <p className="text-black text-md">Initial Price</p>
                      <p className="text-2xl font-bold">
                        ${currentProperty.JSONData.attributes.initialSharePrice}
                      </p>
                    </div>
                   
                  </div>
                </div>
                <div className="p-8 bg-white rounded-3xl invest-shadow">
                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-lg text-left text-black">
                        Current Value
                      </p>
                      <p className="text-4xl font-bold">
                        $
                        {currentProperty.priceData[0].Price
                          ? Math.round(
                              currentProperty.priceData[0].Price * totalShares
                            ).toLocaleString("en-US")
                          : "$0"}{" "}
                        <span className="text-sm font-normal text-black">
                          USD
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-black">Original Value</p>
                      <p className="text-4xl font-bold">
                        $
                        {Math.round(
                          currentProperty.JSONData.attributes
                            .initialPropertyValue
                        ).toLocaleString("en-US")}{" "}
                        <span className="text-sm font-normal text-black">
                          USD
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="items-center justify-center px-6 py-4 pb-6 my-5 mb-4 gap-y-4 rounded-2xl bg-black/10">
                    <div className="flex flex-row items-center justify-between text-lg">
                      <p className="">Invested</p>
                      <p className="">
                        $&nbsp;
                        {currentProperty.launchpadData[0].Raised}
                        {/* {(currentProperty.launchpadData.Raised &&
                        currentProperty.launchpadData.Raised.toLocaleString(
                          "en-US"
                        )) ||
                        0} */}
                        <span>&nbsp;USDC</span>
                      </p>
                    </div>
                    <div className="h-2 mt-2 mb-2 bg-gray-200 rounded-full">
                      {/* <div
                className="h-2 bg-black rounded-full"
                style={{ width: "75%" }}
              ></div> */}

                      <Progress
                        aria-label="Loading..."
                        value={
                          (currentProperty.launchpadData[0].Raised /
                            currentProperty.JSONData.attributes
                              .initialPropertyValue) *
                          100
                        }
                        className="max-w-md"
                        classNames={{
                          base: "",
                          track: "h-[10px] bg-white",
                          indicator: "bg-black",
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mb-4">
                    <div>
                      <p className="text-lg text-left text-black">
                        Share Price
                      </p>
                      <p className="text-3xl font-semibold text-left">
                        $
                        {currentProperty.priceData[0].Price
                          ? currentProperty.priceData[0].Price.toFixed(1)
                          : "0.00"}{" "}
                        <span className="text-sm font-normal text-black">
                          USDC
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg text-black">Available Shares</p>
                      <p className="text-3xl font-semibold">
                        {availableShares}
                        {/* <span className="text-sm font-normal text-black">
                        USDC
                      </span> */}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="mb-1 text-lg text-black">
                      Your Balance: {solBalance.toLocaleString()} USDC
                    </p>
                    <input
                      type="text"
                      placeholder="Enter amount of shares to buy"
                      className="w-full px-4 py-2 my-1 text-lg border rounded-lg outline-none bg-black/10"
                      value={investObject.amount}
                      onChange={(e) => {
                        setInvestObject({
                          ...investObject,
                          amount: e.target.value,
                        });
                      }}
                    />
                  </div>

                  <button
                    className="w-full py-2 mb-4 text-lg font-normal text-white bg-black border-2 border-black rounded-xl hover:bg-white hover:text-black"
                    onClick={() => {
                      handleBuy();
                    }}
                  >
                    Invest Now with
                    <span className="font-bold">
                      {" "}
                      {(
                        investObject.amount * currentProperty.priceData[0].Price
                      ).toFixed(1)}{" "}
                    </span>
                    USDC{/* in SOL */}
                    {/* <span className="font-bold">
                    {(
                      investObject.amount *
                      currentProperty.priceData[0].Price *
                      0.0065112644875634845
                    ).toFixed(3)}{" "}
                  </span>
                  SOL */}
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full p-6 md:w-[40rem] md:sticky md:top-0 md:h-screen flex flex-col gap-y-4">
                {/* token metadata container */}
                <div className="flex flex-col items-start p-8 bg-white rounded-3xl invest-shadow">
                  {/* header */}
                  <div className="">
                    <p className="text-2xl font-bold">Share Listings</p>
                  </div>
                  {/* table */}
                  {
                    sellOrdersForProperty.length >= 0 ? (
                      <div>
                        <p className="my-4 text-lg text-black/50">
                          No Listings available. Please check launchpad projects
                          for investment opportunities.
                        </p>
                        <button
                          className="w-full py-2 text-lg font-normal text-white bg-black border-2 border-black rounded-xl hover:bg-white hover:text-black"
                          onClick={() => {
                            navigate("/dashboard");
                          }}
                        >
                          Go to Launchpad
                        </button>
                      </div>
                    ) : null
                    // <div>
                    //   <Table
                    //     aria-label="Sell orders table"
                    //     sortDescriptor={sortDescriptor}
                    //     onSortChange={setSortDescriptor}
                    //   >
                    //     <TableHeader
                    //       columns={[
                    //         { uid: "sellPrice", name: "Selling Price" },
                    //         { uid: "sharesListed", name: "Shares Listed" },
                    //         { uid: "totalPrice", name: "Total Price" },
                    //         { uid: "actions", name: "Actions" },
                    //       ]}
                    //       className="text-lg"
                    //     >
                    //       {(column) => (
                    //         <TableColumn
                    //           key={column.uid}
                    //           allowsSorting
                    //           align="start"
                    //           className="text-md text-alpha"
                    //         >
                    //           {column.name}
                    //         </TableColumn>
                    //       )}
                    //     </TableHeader>
                    //     <TableBody items={sortedSellOrders}>
                    //       {(item) => (
                    //         <TableRow key={item.id}>
                    //           <TableCell>
                    //             ${item.PricePerShare.toFixed(2)}
                    //           </TableCell>
                    //           <TableCell>{item.Quantity}</TableCell>
                    //           <TableCell>
                    //             $
                    //             {(item.PricePerShare * item.Quantity).toFixed(
                    //               2
                    //             )}
                    //           </TableCell>
                    //           <TableCell>
                    //             <div className="flex gap-x-2">
                    //               <Button
                    //                 onClick={() =>
                    //                   handleTradeBuy(
                    //                     item.PricePerShare,
                    //                     item.Quantity,
                    //                     item.SellerAddress
                    //                   )
                    //                 }
                    //                 className="border-2 rounded-full bg-alpha text-beta border-alpha hover:bg-beta hover:text-alpha hover:cursor-pointer"
                    //               >
                    //                 Buy
                    //               </Button>
                    //             </div>
                    //           </TableCell>
                    //         </TableRow>
                    //       )}
                    //     </TableBody>
                    //   </Table>
                    // </div>
                  }
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* bottom calculator */}
      {displayCalculator === true ? (
        <div className="fixed bottom-0 z-50 px-6 pt-4 pb-6 text-white transform -translate-x-1/2 border-black bg-alpha left-1/2 w-fit h-fit rounded-t-2xl">
          {/* hide button */}
          <p
            className="flex flex-row items-center justify-center py-[2px] mb-4 mb-2 text-xs text-white font-bold rounded-md bg-none gap-x-2 hover:cursor-pointer"
            onClick={() => setDisplayCalculator(!displayCalculator)}
          >
            <FontAwesomeIcon icon={faChevronDown} />
            Hide
          </p>

          <div className="flex flex-row items-center justify-between gap-x-32">
            {/* left container */}
            <div className="flex flex-col items-start justify-start">
              <p className="text-lg font-bold leading-tight text-left ">
                Calculate your<br></br>Investments
              </p>
            </div>

            {/* right container */}
            <div className="flex flex-row items-center gap-x-6">
              {/* appreciation  */}
              <div className="flex flex-col items-end">
                <p className=" text-md">Appreciation</p>
                <p className="text-lg font-bold ">10%</p>
              </div>

              {/* rent */}
              <div className="flex flex-col items-end ml-4">
                <p className=" text-md">
                  Rent
                  <span className="text-xs font-light font-normal ">
                    &nbsp;&nbsp;(/yr)
                  </span>
                </p>
                <p className="text-lg font-bold ">5%</p>
              </div>

              {/* profit */}
              <div className="flex flex-col ml-4">
                <div className="flex flex-row items-center justify-end gap-x-2">
                  <div className="flex flex-row items-center gap-x-2">
                    <p className="text-xs font-light ">Monthly</p>
                    <input
                      type="checkbox"
                      className="toggle toggle-xs"
                      onClick={handleToggleMonthYearDisplay}
                    />
                    <p className="text-xs font-light ">Yearly</p>
                  </div>
                  <p className=" text-md">Profit</p>
                </div>
                <div className="flex flex-row items-center justify-end gap-x-4">
                  {/* in USDC */}
                  <p className="text-lg font-bold ">
                    <span className="text-lg font-light ">$&nbsp;</span>
                    {profitDisplay === "monthly"
                      ? profit[1].toFixed(0)
                      : profit[2].toFixed(1)}
                  </p>
                  {/* in SOL */}
                  <p className="ml-2 text-lg font-bold ">
                    {profitDisplay === "monthly"
                      ? (profit[1] * 0.0065112644875634845).toFixed(2)
                      : (profit[2] * 0.0065112644875634845).toFixed(2)}{" "}
                    <span className="text-xs font-light ">SOL</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* divider */}
          <div className="py-2 my-0 divider before:bg-black/10 after:bg-black/10"></div>

          {/* bottom container */}
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row items-center justify-between gap-x-20">
              <div className="flex flex-col items-start w-full gap-y-1">
                <p className=" text-md">Shares</p>
                <Slider
                  size="sm"
                  step={1}
                  maxValue={availableShares}
                  minValue={0}
                  value={shares}
                  onChange={handleSharesChange}
                  // onInputCapture={handleSharesChange}
                  aria-label="Shares"
                  defaultValue={20}
                  classNames={{
                    base: "max-w-md",
                    track: "border-s-beta",
                    filler: "bg-beta",
                    thumb: "bg-beta",
                  }}
                />
              </div>
              <div>
                {/* <p className="w-32 text-3xl font-bold ">{shares}</p> */}
                <input
                  type="number"
                  value={shares}
                  onChange={handleSharesChange}
                  className="items-center justify-center w-32 text-3xl font-bold text-center outline-none bg-alpha text-beta"
                />
              </div>
            </div>
            <div className="flex flex-row items-end justify-between gap-x-20">
              <div className="flex flex-col items-start w-full gap-y-1">
                <p className=" text-md">Period (months)</p>
                <Slider
                  size="sm"
                  step={1}
                  maxValue={12 * 10}
                  minValue={0}
                  value={period}
                  onChange={handlePeriodChange}
                  aria-label="Period"
                  defaultValue={12}
                  classNames={{
                    base: "max-w-md",
                    track: "border-s-beta",
                    filler: "bg-beta",
                    thumb: "bg-beta",
                  }}
                />
              </div>

              <div>
                <p className="w-32 text-xl font-bold ">{yearsMonths(period)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-0 z-50 ml-8 text-white transform bg-none w-fit h-fit rounded-t-2xl">
          <button
            className="w-full px-6 py-2 mb-4 font-bold text-white bg-black border-2 border-black text-md rounded-xl hover:bg-white hover:text-black"
            onClick={() => setDisplayCalculator(!displayCalculator)}
          >
            Show Calculator
          </button>
        </div>
      )}
    </>
  );
};

export default PropertyView;
