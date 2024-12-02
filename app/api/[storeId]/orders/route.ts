import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { collection,  getDocs, query, where, Timestamp } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};
export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);
        const storeId = url.pathname.split('/')[2]; // Lấy storeId từ đường dẫn
        const userId = url.searchParams.get("userId"); // Lấy userId từ query parameters
        const dateParam = url.searchParams.get("date") || "today"; // Mặc định là "today"
        const statusParam = url.searchParams.get("status"); // Lấy tham số trạng thái từ request

        console.log('Store ID:', storeId);
        console.log('User ID:', userId); // Log giá trị userId

        // Kiểm tra nếu userId không được cung cấp
        if (!userId) {
            return new NextResponse('UserId is Missing', { status: 400, headers: corsHeaders });
        }

        // Tạo truy vấn
        let orderQuery = query(
            collection(db, "stores", storeId, "orders"),
            where("orderedBy", "==", userId) // Lọc theo userId
        );

        // Nếu bạn có thêm điều kiện lọc khác, hãy thêm vào đây
        // Ví dụ: lọc theo trạng thái đơn hàng
        if (statusParam) {
            orderQuery = query(orderQuery, where("order_status", "==", statusParam));
        }

        if (dateParam) {
            const today = new Date();
        
            switch (dateParam) {
                case "today": {
                    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
                    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
                    orderQuery = query(
                        orderQuery,
                        where("createAt", ">=", Timestamp.fromDate(startOfDay)),
                        where("createAt", "<=", Timestamp.fromDate(endOfDay))
                    );
                    break;
                }
        
                case "this-week": {
                    const startOfWeek = new Date(today);
                    startOfWeek.setDate(today.getDate() - today.getDay()); // Lấy ngày đầu tuần (Chủ Nhật)
                    startOfWeek.setHours(0, 0, 0, 0);
        
                    const endOfWeek = new Date(today);
                    endOfWeek.setDate(startOfWeek.getDate() + 6); // Ngày cuối tuần (Thứ Bảy)
                    endOfWeek.setHours(23, 59, 59, 999);
        
                    orderQuery = query(
                        orderQuery,
                        where("createAt", ">=", Timestamp.fromDate(startOfWeek)),
                        where("createAt", "<=", Timestamp.fromDate(endOfWeek))
                    );
                    break;
                }
        
                case "whole-time": {
                    // Không giới hạn thời gian (lấy tất cả dữ liệu)
                    break; // Không cần thêm điều kiện thời gian
                }
        
                default: {
                    try {
                        const dateObject = JSON.parse(dateParam);
                        const startOfDay = new Date(dateObject.seconds * 1000);
                        startOfDay.setHours(0, 0, 0, 0);
        
                        const endOfDay = new Date(dateObject.seconds * 1000);
                        endOfDay.setHours(23, 59, 59, 999);
        
                        orderQuery = query(
                            orderQuery,
                            where("createAt", ">=", Timestamp.fromDate(startOfDay)),
                            where("createAt", "<=", Timestamp.fromDate(endOfDay))
                        );
                    } catch (error) {
                        console.error('Invalid date parameter:', error);
                        return new NextResponse('Invalid date parameter', { status: 400, headers: corsHeaders });
                    }
                    break;
                }
            }
        }
        

        // Thực hiện truy vấn
        const orderSnapshot = await getDocs(orderQuery);
        const orderData: Orders[] = orderSnapshot.docs.map((doc) => doc.data() as Orders);
        console.log('Order Data:', orderData); // Log dữ liệu đơn hàng

        // Nếu không tìm thấy đơn hàng, trả về phản hồi 404
        if (orderData.length === 0) {
            return new NextResponse('No orders found for this user', { status: 404, headers: corsHeaders });
        }

        // Trả về các đơn hàng đã lấy
        return NextResponse.json(orderData, { headers: corsHeaders });

    } catch (error) {
        console.error(`ORDER_GET: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500, headers: corsHeaders });
    }
};