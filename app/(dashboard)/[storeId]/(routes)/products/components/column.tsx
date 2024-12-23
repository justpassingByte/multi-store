"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"

export type ProductsColumn = {
  id: string
  name: string
  price: number
  isFeature: boolean
  isArchieve: boolean
  category: string
  size: string
  kitchen: string
  cuisine: string
  date: string 
}

const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  });
  return formatter.format(price);
};

// Define the columns based on the ProductColumn type
export const columns: ColumnDef<ProductsColumn>[] = [
  {
    accessorKey: "name",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Name"
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
    accessorKey: "isFeature",
    cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
    header: () => "Feature",
  },  
    {
      accessorKey: "archieve",
      cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No"),
      header: () => "Archieve",
    },   
  {
    accessorKey: "category",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Category",
  },
  {
    accessorKey: "size",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Size",
  },
  {
    accessorKey: "kitchen",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Kitchen",
  },
  {
    accessorKey: "cuisine",
    cell: ({ getValue }) => getValue<string>(),
    header: () => "Cuisine",
  },
  // {
  //   accessorKey: "date",
  //   cell: ({ getValue }) => getValue<string>(),
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //     >
  //       Date
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   ),
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
