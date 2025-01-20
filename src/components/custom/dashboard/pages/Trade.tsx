import React, { useState, useMemo, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { usePropertiesStore } from "../../../../state-management/store";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faArrowTrendDown,
} from "@fortawesome/free-solid-svg-icons";
import solCoin from "../../../../assets/svg/sol-coin.svg";
import usdcCoin from "../../../../assets/svg/usd-coin.svg";
import usdtCoin from "../../../../assets/svg/usdt-coin.svg";

export default function Launchpad() {
  const navigate = useNavigate();
  const {
    fetchProperties,
    properties,
    priceData,
    setTotalAssetValue,
    totalAssetValue,
    onChainMasterEditionData,
    fetchOnChainMasterEditionData,
    sellOrderData,
  } = usePropertiesStore();

  const wallet = useWallet();
  const { connection } = useConnection();
  const umi = createUmi(connection)
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

  // Fetching on-chain data when properties are updated
  useEffect(() => {
    if (properties.length > 0) {
      fetchOnChainMasterEditionData(umi, properties);
    }
  }, [properties]);

  let tempAssetValue = 0;

  // Process and flatten the property data for properties with status ""
  const processedProperties = useMemo(() => {
    return properties
      .filter((item) => item.Status === "trading") // Only include properties with status ""
      .map((item) => {
        const propertyType = item.JSONData.attributes.propertyType;
        const initialSharePrice = parseFloat(
          item.JSONData.attributes.initialSharePrice
        );
        const totalShares =
          item.JSONData.attributes.initialPropertyValue /
          item.JSONData.attributes.initialSharePrice;

        // Calculate available shares based on trading status
        let availableShares = 0;
        if (item.Status === "trading" && sellOrderData[item.UUID]) {
          availableShares = sellOrderData[item.UUID].orders.reduce(
            (acc, order) => acc + order.quantity,
            0
          );
          availableShares = totalShares - availableShares;
        } else {
          const edition = onChainMasterEditionData.find(
            (edition) => edition.UUID === item.UUID
          );
          const maxSupply =
            parseInt(edition?.collectionMetadata.edition.maxSupply.value) || 0;
          const supply =
            parseInt(edition?.collectionMetadata.edition.supply) || 0;
          availableShares = maxSupply - supply;
        }

        let currentPrice =
          item.Status === "trading"
            ? priceData.find((price) => price.UUID === item.UUID)?.Price || 0
            : 100;

        let assetValue =
          (item.JSONData.attributes.initialPropertyValue /
            item.JSONData.attributes.initialSharePrice) *
          currentPrice;

        tempAssetValue += assetValue;
        setTotalAssetValue(tempAssetValue);

        return {
          UUID: item.UUID,
          Name: item.Name,
          propertyType,
          initialSharePrice,
          currentPrice,
          totalShares,
          availableShares,
          dividend: item.JSONData.attributes.dividendPerNFT,
          status: item.Status,
          Location: item.Location,
          cover: item.NFTImage,
        };
      });
  }, [properties, priceData, onChainMasterEditionData]);

  const columns = [
    { uid: "cover", name: "" },
    { uid: "Name", name: "Project Name" },
    { uid: "propertyType", name: "Property Type" },
    { uid: "status", name: "Status" },
    { uid: "currentPrice", name: "Current Price" },
    { uid: "growth", name: "Growth" },

    { uid: "availableShares", name: "Available Shares" },
    { uid: "actions", name: "Actions" },
  ];

  const [filterValue, setFilterValue] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<Selection>(
    new Set(["all"])
  );
  const [priceFilter, setPriceFilter] = useState<Selection>(new Set(["all"]));
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "Name",
    direction: "ascending",
  });

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...processedProperties];

    if (filterValue) {
      filtered = filtered.filter((item) =>
        item.Name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (!propertyTypeFilter.has("all")) {
      filtered = filtered.filter((item) =>
        Array.from(propertyTypeFilter).some(
          (type) => type === item.propertyType.toLowerCase()
        )
      );
    }

    if (!priceFilter.has("all")) {
      filtered = filtered.filter((item) => {
        const price = item.currentPrice;
        return Array.from(priceFilter).some((range) => {
          const [minStr, maxStr] = range.split("-");
          const min = parseFloat(minStr);
          const max = maxStr ? parseFloat(maxStr) : Infinity;
          return price >= min && price <= max;
        });
      });
    }

    return filtered;
  }, [filterValue, propertyTypeFilter, priceFilter, processedProperties]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof typeof a];
      const second = b[sortDescriptor.column as keyof typeof b];
      let cmp: number;

      switch (sortDescriptor.column) {
        case "Name":
        case "propertyType":
        case "status":
          cmp = (first as string).localeCompare(second as string);
          break;
        case "currentPrice":
        case "dividend":
        case "availableShares":
          cmp = (first as number) - (second as number);
          break;
        case "growth":
          const growthA =
            ((a.currentPrice - a.initialSharePrice) / a.initialSharePrice) *
            100;
          const growthB =
            ((b.currentPrice - b.initialSharePrice) / b.initialSharePrice) *
            100;
          cmp = growthA - growthB;
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const renderCell = React.useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey as keyof typeof item];

      switch (columnKey) {
        case "actions":
          return (
            <div className="flex flex-row items-center justify-center gap-x-4">
              <button
                className="px-4 py-2 font-bold text-white bg-black border-2 border-black rounded-full hover:bg-white hover:text-black"
                onClick={() => {
                  navigate("/property/view/" + item.UUID);
                }}
              >
                View & Buy
              </button>
            </div>
          );
        case "currentPrice":
          let priceInSOL = cellValue * 0.0063732831968389;
          return (
            <div className="flex flex-row items-center w-full gap-2">
              {/* <div className="flex flex-row items-center gap-x-4">
                <img src={solCoin} alt="SOL" className="w-6 h-6" />
                <p className="w-24 font-bold">
                  {priceInSOL.toFixed(3)}{" "}
                  <span className="font-normal">SOL</span>
                </p>
              </div> */}
              <div className="flex flex-row items-center gap-x-">
                <div className="flex flex-row items-center gap-x-2">
                  <img src={usdcCoin} alt="SOL" className="w-6 h-6" />
                  {/* <img src={usdtCoin} alt="SOL" className="w-6 h-6" /> */}
                </div>
                <p className="ml-3 font-bold ">
                  <span className="font-normal">$</span> {cellValue}
                </p>
              </div>
            </div>
          );
        case "growth":
          const initialPrice = item.initialSharePrice;
          const currentPrice = item.currentPrice;
          const growth = ((currentPrice - initialPrice) / initialPrice) * 100;
          return (
            <p className="flex flex-row items-center gap-2">
              <FontAwesomeIcon
                icon={growth > 0 ? faArrowTrendUp : faArrowTrendDown}
                color={growth > 0 ? "green" : "red"}
              />
              &nbsp;{growth.toFixed(1)}%
            </p>
          );
        case "availableShares":
          return `${item.availableShares}`;
        case "dividend":
          return `${cellValue}%`;
        case "Name":
          return (
            <div className="flex flex-col gap-y-0">
              <p>{cellValue}</p>
              <p className="text-xs text-gray-500">{item.Location}</p>
            </div>
          );
        case "status":
          return cellValue.charAt(0).toUpperCase() + cellValue.slice(1);
        case "cover":
          return (
            <div className="flex flex-row items-center justify-center w-12 h-12 bg-gray-200 rounded-lg">
              <img
                src={item.cover}
                alt="Property"
                className="w-12 h-12 rounded-lg"
              />
            </div>
          );
        default:
          return cellValue;
      }
    },
    [navigate]
  );

  // Define propertyTypes dynamically based on the processed properties
  const propertyTypes = useMemo(() => {
    const uniqueTypes = Array.from(
      new Set(processedProperties.map((item) => item.propertyType))
    );
    return uniqueTypes.map((type) => ({
      uid: type.toLowerCase(),
      name: type.charAt(0).toUpperCase() + type.slice(1),
    }));
  }, [processedProperties]);

  // Generate price ranges dynamically based on current prices
  const priceRanges = useMemo(() => {
    const prices = processedProperties.map((item) => item.currentPrice);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const rangeCount = 4; // Define the number of ranges
    const rangeSize = (maxPrice - minPrice) / rangeCount;

    const ranges = [];
    for (let i = 0; i < rangeCount; i++) {
      const start = minPrice + i * rangeSize;
      const end =
        i < rangeCount - 1 ? minPrice + (i + 1) * rangeSize : Infinity;
      const uid =
        end !== Infinity
          ? `${Math.floor(start)}-${Math.floor(end)}`
          : `${Math.floor(start)}+`;
      const name =
        end !== Infinity
          ? `$${Math.floor(start)} - $${Math.floor(end)}`
          : `$${Math.floor(start)}+`;
      ranges.push({ uid, name });
    }
    return ranges;
  }, [processedProperties]);

  return (
    <div className="w-full max-w-full px-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-normal">Trading Properties</h2>
          <h1 className="text-5xl font-bold">
            Invest Early and Secure Your Future
          </h1>
        </div>
        <div className="text-right">
          <p className="text-2xl">Total Asset Value</p>
          <p className="text-5xl font-bold">
            ${Math.round(totalAssetValue).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 mt-8 mb-6 md:flex-row">
        <div className="flex flex-wrap gap-4">
          {/* Property Type Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon />}
                variant="flat"
                className="h-12 text-md"
              >
                Property Type
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectedKeys={propertyTypeFilter}
              selectionMode="multiple"
              onSelectionChange={setPropertyTypeFilter}
              closeOnSelect={false}
            >
              <DropdownItem key="all">All Types</DropdownItem>
              {propertyTypes.map((type) => (
                <DropdownItem key={type.uid}>{type.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          {/* Price Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon />}
                variant="flat"
                className="h-12 text-md"
              >
                Price
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              selectedKeys={priceFilter}
              selectionMode="multiple"
              onSelectionChange={setPriceFilter}
              closeOnSelect={false}
            >
              <DropdownItem key="all">All Prices</DropdownItem>
              {priceRanges.map((range) => (
                <DropdownItem key={range.uid}>{range.name}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Search Input */}
        <Input
          className="w-full max-w-lg text-xl"
          placeholder="Search for a property by name"
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
          size="lg"
        />
      </div>

      <Table
        aria-label="Trading property investment table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        isStriped
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              allowsSorting
              align={column.uid === "actions" ? "center" : "start"}
              className="text-black text-md"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={sortedItems}>
          {(item) => (
            <TableRow key={`${item.UUID}-${item.currentPrice}`}>
              {(columnKey) => (
                <TableCell className="text-md">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
