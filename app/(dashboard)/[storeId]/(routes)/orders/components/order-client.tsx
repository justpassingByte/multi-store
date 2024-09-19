"use client"


import { DataTable } from "@/components/ui/data-table"
import Heading from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"


import { useParams } from "next/navigation"
import { columns, OrdersColumn } from "./column"
import ApiAlert from "@/components/ui/api-alert"



  interface orderClientProps{
    data: OrdersColumn[]
  }
const OrderClient = ({data}: orderClientProps) => {
  const params = useParams()
  return (
    <>
    <div className="flex items-center justify-between">
      <Heading
        title={`Order (${data.length})`}
        description="Manage order for your store"
      />
    </div>
    <Separator/>
    <DataTable searchKey="name" columns={columns} data={data}/>
    <Heading title="API" description="API calls for order"/>
    <Separator/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/order/`} variant="public"/>
    <ApiAlert title="GET" description={`${origin}/api/${params.storeId}/order/orderId`} variant="public"/>
    <ApiAlert title="POST" description={`${origin}/api/${params.storeId}/order/`} variant="admin"/>
    <ApiAlert title="PATCH" description={`${origin}/api/${params.storeId}/order/orderId`} variant="admin"/>
    <ApiAlert title="DELETE" description={`${origin}/api/${params.storeId}/order/orderId`} variant="admin"/>
    </>
  )
}

export default OrderClient
