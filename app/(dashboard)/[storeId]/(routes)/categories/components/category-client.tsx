"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { CategoriesColumn, columns } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface CategoryClientProps{
    data: CategoriesColumn[]
  }
const CategoryClient = ({data}: CategoryClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Categories (${data.length})`}
        description="Manage Categories for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/categories/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for categories"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/categories/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/categories/categoryId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/categories/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/categories/categoryId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/categories/categoryId`} variant="admin"/>
    </>
  )
}

export default CategoryClient
