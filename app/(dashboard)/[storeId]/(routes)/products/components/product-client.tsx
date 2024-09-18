"use client"

import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { columns, ProductsColumn } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface ProductClientProps{
    data: ProductsColumn[]
  }
const ProductClient = ({data}: ProductClientProps) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Product (${data.length})`}
        description="Manage Product for your store"
      />
      <Button 
        onClick={()=> router.push(`/${params.storeId}/products/create`)}
      >
        <Plus className="h-4 w-4 mr-2"/>
        Add New
      </Button>
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for Product"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/product/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/product/productId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/product/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/product/productId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/product/productId`} variant="admin"/>
    </>
  )
}

export default ProductClient
