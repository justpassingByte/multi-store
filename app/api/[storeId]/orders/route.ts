import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { collection, doc, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders })
}

export const GET = async(req:Request,  {params}: {params:{storeId:string}}) =>{
    try {
        if (!params.storeId) {
          return new NextResponse('StoreId is Missing', { status: 400 ,headers:corsHeaders });
        }
    
        const orderSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'orders'));
        const orderData: Orders[] = orderSnapshot.docs.map(
            (doc) => doc.data() as Orders
        );
    
        return NextResponse.json(orderData,{headers:corsHeaders});
      } catch (error) {
        console.log(`ORDER_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500,headers:corsHeaders});
      }
}