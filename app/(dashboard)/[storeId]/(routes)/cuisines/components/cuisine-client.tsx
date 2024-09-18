"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CuisinesColumn, columns } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface CuisineClientProps{
    data: CuisinesColumn[]
  }
const CuisineClient = ({data}: CuisineClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Cuisine (${data.length})`}
        description="Manage Cuisine for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/cuisines/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Cuisine"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/cuisine/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/cuisine/cuisineId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/cuisine/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/cuisine/cuisineId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/cuisine/cuisineId`} variant="admin"/>
    </>
  )
}

export default CuisineClient
