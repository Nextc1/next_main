import React, { useEffect } from "react";
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
import { usePropertiesStore } from "../../../../state-management/store";

const propertyTypes = [
  { uid: "residential", name: "Residential" },
  { uid: "commercial", name: "Commercial" },
  { uid: "industrial", name: "Industrial" },
  { uid: "emptyPlot", name: "Empty Plot" },
];

const columns = [
  { uid: "propertyName", name: "Project Name" },
  { uid: "location", name: "Location" },
  { uid: "propertyType", name: "Project Type" },
  { uid: "initialSharePrice", name: "Initial Share Price" },
  { uid: "currentPrice", name: "Current Price" },
  { uid: "quantity", name: "Your Shares" },
  { uid: "actions", name: "Actions" },
];

interface Property {
  parentAddress: string;
  quantity: number;
  UUID: string;
  JSONData: {
    name: string;
    description: string;
    attributes: {
      initialSharePrice: number;
      propertyType: string;
      propertyLocation: string;
    };
  };
  priceData: [
    {
      Price: number;
    }
  ];
}

export default function YourPropertiesTable() {
  const { userInvestments } = usePropertiesStore();
  const [portfolioProps, setPortfolioProps] = React.useState<Property[]>([]);
  const [filterValue, setFilterValue] = React.useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = React.useState<Selection>(
    new Set(["all"])
  );
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "propertyName",
    direction: "ascending",
  });

  // Load user investments into the state
  useEffect(() => {
    if (userInvestments.properties) {
      setPortfolioProps(userInvestments.properties);
    }
  }, [userInvestments]);

  // Filter and search logic
  const filteredItems = React.useMemo(() => {
    let filtered = portfolioProps;

    if (filterValue) {
      filtered = filtered.filter((item) =>
        item.JSONData.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (!propertyTypeFilter.has("all")) {
      filtered = filtered.filter((item) =>
        propertyTypeFilter.has(
          item.JSONData.attributes.propertyType.toLowerCase()
        )
      );
    }

    return filtered;
  }, [filterValue, propertyTypeFilter, portfolioProps]);

  // Sorting logic
  const sortedItems = React.useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Property];
      const second = b[sortDescriptor.column as keyof Property];
      let cmp: number;

      switch (sortDescriptor.column) {
        case "propertyName":
          cmp = a.JSONData.name.localeCompare(b.JSONData.name);
          break;
        case "propertyType":
          cmp = a.JSONData.attributes.propertyType.localeCompare(
            b.JSONData.attributes.propertyType
          );
          break;
        case "location":
          cmp = a.JSONData.attributes.propertyLocation.localeCompare(
            b.JSONData.attributes.propertyLocation
          );
          break;
        case "initialSharePrice":
          cmp =
            a.JSONData.attributes.initialSharePrice -
            b.JSONData.attributes.initialSharePrice;
          break;
        case "currentPrice":
          cmp = a.priceData[0].Price - b.priceData[0].Price;
          break;
        case "quantity":
          cmp = a.quantity - b.quantity;
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  // Cell rendering logic
  const renderCell = React.useCallback(
    (item: Property, columnKey: React.Key) => {
      const cellValue = item[columnKey as keyof Property];

      switch (columnKey) {
        case "propertyName":
          return item.JSONData.name;
        case "location":
          return item.Location;
        case "propertyType":
          if (item.JSONData.attributes.propertyType === "residential") {
            return "Residential";
          } else if (item.JSONData.attributes.propertyType === "commercial") {
            return "Commercial";
          } else if (item.JSONData.attributes.propertyType === "industrial") {
            return "Industrial";
          } else if (item.JSONData.attributes.propertyType === "emptyPlot") {
            return "Empty Plot";
          } else {
            return "Farming Land";
          }
        case "initialSharePrice":
          return `$${item.JSONData.attributes.initialSharePrice.toLocaleString()}`;
        case "currentPrice":
          return `$${item.priceData[0].Price.toLocaleString()}`;
        case "quantity":
          return item.quantity;
        case "actions":
          return (
            <button className="px-4 py-2 font-bold text-white bg-black border-2 border-black rounded-full hover:bg-white hover:text-black">
              View
            </button>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className="w-full max-w-full px-4 mx-auto">
      <div className="flex items-center justify-between gap-4 mt-2 mb-4">
        <div className="flex flex-row gap-x-4">
          {/* Property Type Filter */}
          <Dropdown>
            <DropdownTrigger>
              <Button
                endContent={<ChevronDownIcon />}
                variant="flat"
                className="h-12 text-md"
              >
                Project Type
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
        </div>
        <Input
          className="w-full max-w-lg text-xl"
          placeholder="Search for a project by name..."
          startContent={<SearchIcon />}
          value={filterValue}
          onValueChange={setFilterValue}
          size="lg"
        />
      </div>

      <Table
        aria-label="User-owned property table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
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
            <TableRow key={item.UUID} className="pb-2 my-6">
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
