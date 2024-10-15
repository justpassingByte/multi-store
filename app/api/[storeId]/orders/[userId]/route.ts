import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",  // Có thể chỉnh sửa khi cần thiết
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
        const { storeId } = params;
        const { userId } = auth(); // Lấy thông tin xác thực từ Clerk

        if (!storeId) {
            return new NextResponse('StoreId is Missing', { status: 400, headers: corsHeaders });
        }

        // Nếu không có `userId`, trả về thông báo lỗi và không truy xuất Firebase
        if (!userId) {
            return new NextResponse('User not authenticated', { status: 401, headers: corsHeaders });
        }

        // Nếu có `userId`, truy xuất đơn hàng của người dùng đó
        const orderQuery = query(
            collection(db, "stores", storeId, "orders"),
            where("userId", "==", userId)
        );

        // Thực hiện truy vấn Firebase
        const orderSnapshot = await getDocs(orderQuery);
        const orderData: Orders[] = orderSnapshot.docs.map((doc) => doc.data() as Orders);

        // Nếu không có dữ liệu, trả về thông báo tương ứng
        if (orderData.length === 0) {
            return new NextResponse('No orders found for this user', { status: 404, headers: corsHeaders });
        }

        // Trả về dữ liệu đơn hàng
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