"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SizesColumn, columns } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface SizeClientProps{
    data: SizesColumn[]
  }
const SizeClient = ({data}: SizeClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Size (${data.length})`}
        description="Manage Size for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/sizes/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Size"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/size/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/size/sizeId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/size/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/size/sizeId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/size/sizeId`} variant="admin"/>
    </>
  )
}

export default SizeClient
