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
  images: string[],
  createAt: string,
  totalPrice:string,
}
const formatPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', 
  });
  return formatter.format(price);
};
export const columns: ColumnDef<OrdersColumn>[] = [
  {
    accessorKey: "images",
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
    accessorKey: "totalPrice",
    header: ({ column }) => (
      <Button
      
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ getValue }) => formatPrice(getValue<number>()),
  
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
  // {
  //   accessorKey: "createAt",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Date
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
]
