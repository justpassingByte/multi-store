"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { columns, CombosColumn } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface ComboClientProps{
    data: CombosColumn[]
  }
const ComboClient = ({data}: ComboClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Combo (${data.length})`}
        description="Manage Combo for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/combos/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New Combo
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Combo"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/combos/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/combos/comboId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/combos/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/combos/comboId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/combos/comboId`} variant="admin"/>
    </>
  )
}

export default ComboClient
