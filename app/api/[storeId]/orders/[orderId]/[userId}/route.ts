import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: Request, { params }: { params: { storeId: string, userId?: string } }) => {
    try {
        const { storeId, userId } = params;
    
        // Ensure storeId is provided
        if (!storeId) {
            return new NextResponse('StoreId is Missing', { status: 400, headers: corsHeaders });
        }

        let orderQuery;

        // If userId is not provided, fetch all orders for the store
        if (!userId) {
            return new NextResponse('UserId is Missing', { status: 400, headers: corsHeaders });
        } else {
            // If userId is provided, fetch orders for the specific user
            orderQuery = query(
                collection(db, "stores", storeId, "orders"),
                where("userId", "==", userId)
            );
        }

        // Perform the Firebase query
        const orderSnapshot = await getDocs(orderQuery);
        const orderData: Orders[] = orderSnapshot.docs.map((doc) => doc.data() as Orders);

        // If no orders are found, return a 404 response
        if (orderData.length === 0) {
            return new NextResponse('No orders found for this user', { status: 404, headers: corsHeaders });
        }

        // Return the retrieved orders
        return NextResponse.json(orderData, { headers: corsHeaders });

    } catch (error) {
        console.error(`ORDER_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};
