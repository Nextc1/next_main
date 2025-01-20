import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Selection,
  Input,
  SortDescriptor,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { usePropertiesStore } from "../../../../state-management/store";
import { useNavigate } from "react-router-dom";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import toast from "react-hot-toast";
import { set } from "@metaplex-foundation/umi/serializers";

export default function Sell() {
  const navigate = useNavigate();
  const {
    sellOrdersForUser,
    addSellOrder,
    removeSellOrder,
    userInvestments,
    fetchSellOrdersForAUser,
  } = usePropertiesStore();

  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    // this is for minting programmable NFTs
    .use(mplTokenMetadata());
  const [currentUserShare, setCurrentUserShare] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState<number>(0);
  const [sellPrice, setSellPrice] = useState<number>(0);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "propertyName",
    direction: "ascending",
  });

  // Dropdown options for user properties
  const propertyOptions = useMemo(() => {
    return userInvestments.properties.map((property) => ({
      uid: property.UUID,
      name: property.JSONData.name,
      sharesOwned: property.quantity, // User's available shares
    }));
  }, [userInvestments]);

  // Handle form submission for listing shares
  const handleListShares = async () => {
    if (!selectedProperty || shareCount <= 0 || sellPrice <= 0) {
      toast.error("Please fill out all fields with valid values.");
      return;
    }

    const selectedInvestment = userInvestments.properties.find(
      (prop) => prop.UUID === selectedProperty
    );

    if (!selectedInvestment) {
      toast.error("Selected property not found.");
      return;
    }

    if (
      shareCount >
      // get the shares from the currentUserShare array
      currentUserShare.find(
        (prop: { UUID: string; sharesOwned: number }) =>
          prop.UUID === selectedProperty
      )?.sharesOwned
    ) {
      toast.error("You can't list more shares than you own.");
      return;
    }

    // Call addSellOrder function
    await addSellOrder({
      UUID: selectedProperty,
      TokenAddress: selectedInvestment.TokenAddress,
      SellerAddress: umi.identity.publicKey, // Use actual userAddress from auth
      Quantity: shareCount,
      PricePerShare: sellPrice,
    });

    await fetchSellOrdersForAUser(umi.identity?.publicKey);
    setSelectedProperty(null);
    setShareCount(0);
    setSellPrice(0);
  };

  // Handle removing a sell order
  const handleWithdrawListing = async (orderId) => {
    await removeSellOrder(orderId);
    fetchSellOrdersForAUser(umi.identity?.publicKey);
  };

  // Sorting for sell orders
  const sortedSellOrders = useMemo(() => {
    return [...sellOrdersForUser].sort((a, b) => {
      let cmp = 0;

      switch (sortDescriptor.column) {
        case "propertyName":
          // Sort by property name
          cmp = a.propertyData.Name.localeCompare(b.propertyData.Name);
          break;
        case "sellPrice":
          // Sort by selling price per share
          cmp = a.PricePerShare - b.PricePerShare;
          break;
        case "sharesListed":
          // Sort by shares listed
          cmp = a.Quantity - b.Quantity;
          break;
        case "totalPrice":
          // Sort by total price (PricePerShare * Quantity)
          const totalPriceA = a.PricePerShare * a.Quantity;
          const totalPriceB = b.PricePerShare * b.Quantity;
          cmp = totalPriceA - totalPriceB;
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, sellOrdersForUser]);

  // a function to calculate the actual shares they hold right now in the property by taking the shares they own and subtracting the shares they have listed for each project
  const calculateShares = () => {
    // calculate the shares they own for each property by subtracting the shares they have listed and append it to the currentUserShare array as objects
    let shares = [];
    userInvestments.properties.forEach((property) => {
      let sharesOwned = property.quantity;
      sellOrdersForUser.forEach((order) => {
        if (order.UUID === property.UUID) {
          sharesOwned -= order.Quantity;
        }
      });
      shares.push({ UUID: property.UUID, sharesOwned });
    });
    setCurrentUserShare(shares);
  };

  useEffect(() => {
    calculateShares();
  }, [sellOrdersForUser]);

  return (
    <div className="w-full max-w-full px-4 mx-auto">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-normal">List your shares</h2>
          <h1 className="text-5xl font-bold">Sell Your Properties</h1>
        </div>
      </div>

      {/* divider */}
      <div className="py-0 my-0 divider before:bg-black/5 after:bg-black/5"></div>

      {/* sell form */}
      <div className="flex flex-col items-start mb-6">
        <div className="my-3 mb-4">
          <p className="text-xl font-semibold">Sell your shares</p>
        </div>
        <div className="flex flex-row items-end space-x-4">
          <div className="flex flex-col items-start gap-y-1">
            <p className="text-md text-alpha">Select Property</p>
            <Dropdown className="">
              <DropdownTrigger className="">
                <Button
                  endContent={<ChevronDownIcon />}
                  variant="flat"
                  className="px-16 py-4 text-md"
                >
                  {selectedProperty
                    ? propertyOptions.find(
                        (prop: {
                          uid: string;
                          name: string;
                          sharesOwned: number;
                        }) => prop.uid === selectedProperty
                      )?.name +
                      " (" +
                      // display the shares from the currentUserShare array
                      currentUserShare.find(
                        (prop: { UUID: string; sharesOwned: number }) =>
                          prop.UUID === selectedProperty
                      )?.sharesOwned +
                      ")"
                    : "Select Property"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                selectionMode="single"
                selectedKeys={new Set([selectedProperty])}
                onSelectionChange={(keys) =>
                  setSelectedProperty(keys.anchorKey)
                }
              >
                {propertyOptions.map((property) => (
                  <DropdownItem key={property.uid}>
                    {property.name +
                      " (" +
                      // display the shares from the currentUserShare array
                      currentUserShare.find(
                        (prop: { UUID: string; sharesOwned: number }) =>
                          prop.UUID === property.uid
                      )?.sharesOwned +
                      ")"}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex flex-col items-start gap-y-1">
            <p className="text-md text-alpha">Number of shares</p>
            <Input
              placeholder="Enter number of shares"
              type="number"
              value={shareCount}
              onValueChange={(value) => setShareCount(parseInt(value))}
              className="w-[15rem]"
            />
          </div>

          <div className="flex flex-col items-start gap-y-1">
            <p className="text-md text-alpha">
              Selling price per share (in USD)
            </p>
            <Input
              placeholder="Enter selling price per share"
              type="number"
              value={sellPrice}
              onValueChange={(value) => setSellPrice(parseFloat(value))}
              className="w-[15rem]"
            />
          </div>

          {/*  a disabled input that multiplies and shows the final total amount */}
          <div className="flex flex-col items-start gap-y-1">
            <p className="text-md text-alpha">Number of shares</p>
            <Input
              placeholder="Total Amount"
              type="number"
              value={(sellPrice * shareCount).toFixed(2)}
              disabled
              className="w-[15rem]"
            />
          </div>

          <Button onClick={handleListShares} className="bg-alpha text-beta">
            List Shares
          </Button>
        </div>
      </div>

      {/* listing table */}
      <div className="flex flex-col items-start">
        <div className="my-3 mb-4">
          <p className="text-xl font-semibold">Your Listed Shares</p>
        </div>
        <Table
          aria-label="Sell orders table"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader
            columns={[
              { uid: "propertyName", name: "Project Name" },
              { uid: "location", name: "Location" },
              { uid: "sellPrice", name: "Selling Price" },
              { uid: "sharesListed", name: "Shares Listed" },
              { uid: "totalPrice", name: "Total Price" },
              { uid: "actions", name: "Actions" },
            ]}
            className="text-lg"
          >
            {(column) => (
              <TableColumn
                key={column.uid}
                allowsSorting
                align="start"
                className="text-md text-alpha"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={sortedSellOrders}>
            {(item) => (
              <TableRow key={item.id}>
                <TableCell>{item.propertyData.Name}</TableCell>
                <TableCell>{item.propertyData.Location}</TableCell>
                <TableCell>${item.PricePerShare.toFixed(2)}</TableCell>
                <TableCell>{item.Quantity}</TableCell>
                <TableCell>
                  ${(item.PricePerShare * item.Quantity).toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-x-2">
                    <Button
                      onClick={() =>
                        window.open(
                          `https://exira.io/property/view/${item.UUID}`,
                          "_blank"
                        )
                      }
                      className="border-2 rounded-full bg-alpha text-beta border-alpha hover:bg-beta hover:text-alpha hover:cursor-pointer"
                    >
                      View Project
                    </Button>
                    <Button
                      onClick={() => handleWithdrawListing(item.id)}
                      className="bg-red-500 border-2 border-red-500 rounded-full text-beta hover:bg-beta hover:text-red-500 hover:cursor-pointer"
                    >
                      Withdraw
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
