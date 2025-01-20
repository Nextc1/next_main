import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Selection,
  SortDescriptor,
} from "@nextui-org/react";
import { SearchIcon } from "../icons/SearchIcon";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import Mapbox from "../sub-components/Mapbox";
import Counter from "../../../animata/Counter";
import YourPropertiesTable from "../sub-components/YourPropertiesTable";
import { usePropertiesStore } from "../../../../state-management/store";
import { useNavigate } from "react-router-dom";

interface Property {
  id: number;
  propertyName: string;
  location: string;
  country: string;
  propertyType: string;
  ticketPrice: string;
  currentPrice: string;
  totalShares: string;
  yourShares?: number;
  originalTicketPrice: string;
  latitude: number;
  longitude: number;
}

const dummyData: Property[] = [
  {
    id: 1,
    propertyName: "Riverside Apartments",
    location: "Bengaluru, India",
    country: "India",
    propertyType: "Residential",
    ticketPrice: "$25",
    originalTicketPrice: "$20",
    currentPrice: "Not Trading",
    totalShares: "4533 / 6800",
    yourShares: 1000, // Less than 4533
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: 2,
    propertyName: "Central Mall",
    location: "Paris, France",
    country: "France",
    propertyType: "Commercial",
    ticketPrice: "$345",
    originalTicketPrice: "$300",
    currentPrice: "Not Trading",
    totalShares: "90 / 980",
    latitude: 48.8566,
    longitude: 2.3522,
  },
  {
    id: 3,
    propertyName: "Dzokevic Warehouse",
    location: "St.Petersburg, Russia",
    country: "Russia",
    propertyType: "Industrial",
    ticketPrice: "$85",
    originalTicketPrice: "$80",
    currentPrice: "$85.5 / share",
    totalShares: "90 / 980",
    yourShares: 50, // Less than 90
    latitude: 59.9343,
    longitude: 30.3351,
  },
  {
    id: 4,
    propertyName: "Sunset Condos",
    location: "Mumbai, India",
    country: "India",
    propertyType: "Residential",
    ticketPrice: "$50",
    originalTicketPrice: "$45",
    currentPrice: "Not Trading",
    totalShares: "2000 / 3000",
    latitude: 19.076,
    longitude: 72.8777,
  },
  {
    id: 5,
    propertyName: "Tech Park",
    location: "San Francisco, USA",
    country: "USA",
    propertyType: "Commercial",
    ticketPrice: "$1200",
    originalTicketPrice: "$1150",
    currentPrice: "$1250 / share",
    totalShares: "50 / 100",
    yourShares: 20, // Less than 50
    latitude: 37.7749,
    longitude: -122.4194,
  },
];

function Portfolio(props) {
  const navigate = useNavigate();
  const { userInvestments, userTransactions } = usePropertiesStore();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [metadata, setMetadata] = useState({
    totalProfit: 0,
    totalCurrentPortfolioValue: 0,
    totalPropertiesHeld: 0,
    totalSharesHeld: 0,
    properties: [],
  });

  useEffect(() => {
    if (userInvestments) {
      if (userInvestments.length !== 0) {
        setMetadata({
          totalProfit: userInvestments.totalProfit,
          totalCurrentPortfolioValue:
            userInvestments.totalCurrentPortfolioValue,
          totalPropertiesHeld: userInvestments.totalPropertiesHeld,
          totalSharesHeld: userInvestments.totalSharesHeld,
          properties: userInvestments.properties,
        });
        setDataLoaded(true);
      }
    }
  }, [userInvestments]);
  // Calculate stats
  // const propertiesWithYourShares = dummyData.filter(
  //   (item) => item.yourShares !== undefined
  // );

  // const totalInvestedAmount = propertiesWithYourShares.reduce((sum, item) => {
  //   const ticketPrice = parseFloat(item.ticketPrice.replace("$", ""));
  //   return sum + ticketPrice * (item.yourShares || 0);
  // }, 0);

  // const totalOriginalAmount = propertiesWithYourShares.reduce((sum, item) => {
  //   const originalPrice = parseFloat(item.originalTicketPrice.replace("$", ""));
  //   return sum + originalPrice * (item.yourShares || 0);
  // }, 0);

  // const totalProfit = totalInvestedAmount - totalOriginalAmount;

  // const totalPropertiesOwned = propertiesWithYourShares.length;

  // const totalSharesHeld = propertiesWithYourShares.reduce(
  //   (sum, item) => sum + (item.yourShares || 0),
  //   0
  // );

  useEffect(() => {
    console.log("userInvestments", userInvestments);
  }, [userInvestments]);

  return (
    <>
      {dataLoaded === false ? null : (
        <div className="flex flex-col w-full max-w-full px-4 mx-auto">
          <div className="flex flex-row space-x-6">
            <div className="w-1/2">
              <div className="flex flex-col">
                {/* 2x2 Number Stat Grids */}
                <div className="text-left">
                  <p className="text-lg">Portfolio Stats</p>
                </div>
                <div className="py-0 my-0 divider before:bg-black/5 after:bg-black/5"></div>
                <div className="grid grid-cols-2 gap-6 p-4 mb-6 text-center gap-y-6">
                  <div className="flex flex-col items-center justify-center py-10 text-black bg-black/10 gap-y-1 rounded-2xl">
                    <div className="flex flex-row items-end justify-center gap-x-3">
                      <p className="text-4xl">$</p>
                      {metadata.totalCurrentPortfolioValue <= 0 ? (
                        <p className="text-5xl font-bold text-black">0</p>
                      ) : (
                        <Counter
                          targetValue={metadata.totalCurrentPortfolioValue}
                          direction="up"
                          format={(value) => `${value.toFixed(0)}`}
                        />
                      )}
                    </div>
                    <div className="text-2xl">Your Portfolio</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 text-black bg-black/10 gap-y-1 rounded-2xl">
                    <div className="flex flex-row items-end justify-center gap-x-3">
                      <p className="text-4xl">$</p>
                      {metadata.totalProfit <= 0 ? (
                        <p className="text-5xl font-bold text-black">0</p>
                      ) : (
                        <Counter
                          targetValue={metadata.totalProfit}
                          direction="up"
                          format={(value) => `${value.toFixed(0)}`}
                        />
                      )}
                    </div>
                    <div className="text-2xl">Total Profit</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-black bg-black/10 gap-y-1 rounded-2xl">
                    {metadata.totalPropertiesHeld <= 0 ? (
                      <p className="text-5xl font-bold text-black">0</p>
                    ) : (
                      <Counter
                        targetValue={metadata.totalPropertiesHeld}
                        direction="up"
                        format={(value) => `${value.toFixed(0)}`}
                      />
                    )}

                    <div className="text-2xl">Total Projects Owned</div>
                  </div>
                  <div className="flex flex-col items-center justify-center py-8 text-black bg-black/10 gap-y-1 rounded-2xl">
                    {metadata.totalSharesHeld <= 0 ? (
                      <p className="text-5xl font-bold text-black">0</p>
                    ) : (
                      <Counter
                        targetValue={metadata.totalSharesHeld}
                        direction="up"
                        format={(value) => `${value.toFixed(0)}`}
                      />
                    )}
                    <div className="text-2xl">Total Shares Held</div>
                  </div>
                </div>

                {/* button */}
                <div className="flex flex-row justify-center">
                  <button
                    className="w-full py-3 mx-4 text-lg text-white bg-black border-2 border-black rounded-xl hover:bg-white hover:text-black "
                    onClick={() => navigate("/dashboard")}
                  >
                    Invest More
                  </button>
                </div>
              </div>
            </div>
            {/* Mapbox Component */}
            <div className="w-[50rem] h-[30rem]">
              <div className="text-left">
                <p className="text-lg">Locate your shares</p>
              </div>
              <div className="py-0 my-0 divider before:bg-black/5 after:bg-black/5"></div>
              <Mapbox dummyData={dummyData} data={metadata.properties} />
            </div>
          </div>

          {/* Rest of your component (e.g., tables, additional UI elements) */}
          <div className="pt-8 text-left">
            <p className="text-lg">Your Projects</p>
          </div>
          <div className="py-0 my-0 divider before:bg-black/5 after:bg-black/5"></div>
          <YourPropertiesTable dummyData={dummyData} />
        </div>
      )}
    </>
  );
}

export default Portfolio;
