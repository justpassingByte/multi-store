"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { BillBoardColumn, columns } from "./column"
import ApiAlert from "@/components/ui/api-alert"

  interface BillBoardClientProps{
    data: BillBoardColumn[]
  }
const BillBoardClient = ({data}: BillBoardClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`BillBoards (${data.length})`}
        description="Manage billboards for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/billboards/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="label" columns={columns} data={data}/>
    <Heading title="API" description="API calls for billboards"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/billboards/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/billboards/billboardId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/billboards/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/billboards/billboardId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/billboards/billboardId`} variant="admin"/>
    
    </>
  )
}

export default BillBoardClient
