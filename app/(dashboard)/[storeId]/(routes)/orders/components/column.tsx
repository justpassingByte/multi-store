"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"
import { Products } from "@/type-db"
import CellImage from "./cell-image"

export type OrdersColumn = {
  id: string,
  isPaid: boolean,
  phone: string,
  orderItems: Products[],
  address: string,
  order_status: string,
  images: string[]
  createAt: string
}

export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "orderItems",
    header: "Images",
    cell: ({ row }) => (
      <div className="grid grid-cols-2 gap-2">
        <CellImage data={row.original.images}/>
      </div>
    )
  },
  {
    accessorKey: "orderItems",
    header: "Products",
    cell: ({ row }) => (
      <ul>
        {row.original.orderItems.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul>
    )
  },
  {
    accessorKey: "phone",
    header: () => "Phone"
 
  },
  {
    accessorKey: "address",
    header: () => "Address"
  
  },
  {
    accessorKey: "isPaid",
    header: () => {
    return "Paid"
    },
    cell: ({ row }) => (
      <span>{row.original.isPaid ? "Yes" : "No"}</span>
    )
  },
  {
    accessorKey: "order_status",
    header: () => "Status"
 
  },
  {
    accessorKey: "createAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
