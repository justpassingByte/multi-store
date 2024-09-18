"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellImage } from "./cell-image"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { CellAction } from "./cell-action"
import { Timestamp } from "firebase/firestore"


export type BillBoardColumn = {
  id: string
  label: string
  imageUrl: string
  createAt: string | Timestamp;
}

export const columns: ColumnDef<BillBoardColumn>[] = [
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({row}) =>{
        const {imageUrl} = row.original
        return (
            <CellImage imageUrl={imageUrl}/>
        )
    }
  },
  {
    accessorKey: "label",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
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
    cell: ({row}) => <CellAction data={row.original}/>
  },
]
