"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { KitchensColumn, columns } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface KitchenClientProps{
    data: KitchensColumn[]
  }
const KitchenClient = ({data}: KitchenClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Kitchen (${data.length})`}
        description="Manage Kitchen for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/kitchens/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Kitchen"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/kitchen/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/kitchen/kitchenId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/kitchen/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/kitchen/kitchenId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/kitchen/kitchenId`} variant="admin"/>
    </>
  )
}

export default KitchenClient
