import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  SortDescriptor,
} from "@nextui-org/react";
import { ChevronDownIcon } from "../icons/ChevronDownIcon";
import { usePropertiesStore } from "../../../../state-management/store";

const txnColumns = [
  { uid: "propertyName", name: "Project Name" },
  { uid: "location", name: "Location" },
  { uid: "ticketPrice", name: "Ticket Price" },
  { uid: "sharesBought", name: "Shares Bought" },
  { uid: "purchasedOn", name: "Purchased On" },
  { uid: "totalPaid", name: "Total Paid" },
  { uid: "actions", name: "Actions" },
];

export default function History() {
  const { userTransactions } = usePropertiesStore();

  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "propertyName",
    direction: "ascending",
  });

  const sortedItems = React.useMemo(() => {
    return [...userTransactions].sort((a, b) => {
      const first =
        a[sortDescriptor.column as keyof (typeof userTransactions)[0]];
      const second =
        b[sortDescriptor.column as keyof (typeof userTransactions)[0]];
      let cmp: number;

      switch (sortDescriptor.column) {
        case "propertyName":
          cmp = a.propertyData.Name.localeCompare(b.propertyData.Name);
          break;
        case "location":
          cmp = a.propertyData.Location.localeCompare(b.propertyData.Location);
          break;
        case "ticketPrice":
          cmp = a.Price - b.Price;
          break;
        case "sharesBought":
          cmp = a.Quantity - b.Quantity;
          break;
        case "purchasedOn":
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          cmp = dateA - dateB;
          break;
        default:
          cmp = 0;
      }

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, userTransactions]);

  const renderCell = React.useCallback((item, columnKey) => {
    const cellValue = item[columnKey as keyof (typeof userTransactions)[0]];

    switch (columnKey) {
      case "actions":
        return (
          <a
            href={`https://explorer.solana.com/tx/${item.Hash}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-white bg-black border-2 border-black rounded-full hover:bg-white hover:text-black"
          >
            View Txn
          </a>
        );
      case "purchasedOn":
        return new Date(item.created_at).toLocaleDateString(); // Format date
      case "totalPaid":
        return `$${(item.Price * item.Quantity).toFixed(2)}`; // Calculate Total Paid
      case "propertyName":
        return item.propertyData.Name;
      case "location":
        return item.propertyData.Location;
      case "ticketPrice":
        return `$${item.Price.toLocaleString()}`;
      case "sharesBought":
        return item.Quantity;
      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="w-full max-w-full px-4 mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col items-start">
          <h2 className="text-2xl font-normal">Transaction History</h2>
          <h1 className="text-5xl font-bold">Your Investment Records</h1>
        </div>
      </div>

      <Table
        aria-label="Transaction history table"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={txnColumns}>
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
        <TableBody items={sortedItems} className="py-2">
          {(item) => (
            <TableRow key={item.id} className="">
              {(columnKey) => (
                <TableCell className="py-3 text-md">
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
