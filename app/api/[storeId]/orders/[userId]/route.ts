import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: Request, { params }: { params: { storeId: string, userId: string } }) => {
    try {
        const { storeId, userId } = params;

        if (!storeId) {
            return new NextResponse('StoreId is Missing', { status: 400, headers: corsHeaders });
        }

        // Create the query based on whether userId is provided
        let orderQuery;
        if (userId) {
            orderQuery = query(collection(db, "stores", storeId, "orders"), where("userId", "==", userId));
        } else {
            orderQuery = collection(db, "stores", storeId, "orders");
        }

        const orderSnapshot = await getDocs(orderQuery);
        const orderData: Orders[] = orderSnapshot.docs.map((doc) => doc.data() as Orders);

        return NextResponse.json(orderData, { headers: corsHeaders });
    } catch (error) {
        console.error(`ORDER_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};
