"use client"

import { Button } from "@/components/ui/button"
import Heading from "@/components/ui/heading"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

const BillBoardClient = () => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`BillBoards (0)`}
        description="Manage billboards for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/billboards/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    </>
  )
}

export default BillBoardClient
