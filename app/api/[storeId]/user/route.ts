import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const GET = async (req: Request) => {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return new NextResponse('UserId is Missing', { status: 400, headers: corsHeaders });
        }

        const orderQuery = query(
            collection(db, "orders"),
            where("userId", "==", userId)
        );

        const orderSnapshot = await getDocs(orderQuery);
        const orderData = orderSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ orders: orderData }, { headers: corsHeaders });

    } catch (error) {
        console.error(`ORDER_HISTORY_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};
