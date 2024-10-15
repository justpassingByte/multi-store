import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        const { storeId } = params;

        if (!storeId) {
            return new NextResponse('StoreId is Missing', { status: 400, headers: corsHeaders });
        }
        // Create the query based on whether userId is provided
    
         const  orderQuery = collection(db, "stores", storeId, "orders");
       

        const orderSnapshot = await getDocs(orderQuery);
        const orderData: Orders[] = orderSnapshot.docs.map((doc) => doc.data() as Orders);

        return NextResponse.json(orderData, { headers: corsHeaders });
    } catch (error) {
        console.error(`ORDER_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};
export const DELETE = async (req: Request, { params }: { params: { storeId: string, orderId: string } }) => {
    try {
        const { storeId, orderId } = params;

        if (!storeId || !orderId) {
            return new NextResponse('StoreId or OrderId is Missing', { status: 400, headers: corsHeaders });
        }

        // Xóa đơn hàng từ Firestore
        const orderRef = doc(db, "stores", storeId, "orders", orderId);
        await deleteDoc(orderRef);

        return NextResponse.json({ message: 'Order deleted successfully' }, { headers: corsHeaders });

    } catch (error) {
        console.error(`ORDER_DELETE: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};
export const PATCH = async (req: Request, { params }: { params: { storeId: string, orderId: string } }) => {
    try {
        const { storeId, orderId } = params;

        if (!storeId || !orderId) {
            return new NextResponse('StoreId or OrderId is Missing', { status: 400, headers: corsHeaders });
        }

        const body = await req.json();
        const { order_status } = body; // Giả sử bạn chỉ muốn cập nhật trạng thái đơn hàng

        if (!order_status) {
            return new NextResponse('Order status is required', { status: 400, headers: corsHeaders });
        }

        // Cập nhật trạng thái đơn hàng trong Firestore
        const orderRef = doc(db, "stores", storeId, "orders", orderId);
        await updateDoc(orderRef, { order_status });

        return NextResponse.json({ message: 'Order updated successfully' }, { headers: corsHeaders });

    } catch (error) {
        console.error(`ORDER_PATCH: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};