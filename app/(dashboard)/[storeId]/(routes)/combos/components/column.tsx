"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"
import { Products } from "@/type-db"

export type CombosColumn = {
  id: string
  name: string
  price: number
  products?: Products[]
  description: string
}

const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  });
  return formatter.format(price);
};

export const columns: ColumnDef<CombosColumn>[] = [
  {
    accessorKey: "name",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Combo Name"
  },
  {
    accessorKey: "price",
    cell: ({ getValue }) => formatPrice(getValue<number>()),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "products",
    cell: ({ getValue }) => {
      const products = getValue<string[]>();
      return products ? products.join(", ") : ""; // Check if products is defined
    },
    header: () => "Products",
  },
  {
    accessorKey: "description",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Description",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
