import { db, storage } from "@/lib/firebase";
import { Orders } from "@/type-db";
import {  doc, deleteDoc, getDoc, updateDoc, serverTimestamp, query, collection, where, getDocs } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",  // Có thể chỉnh sửa khi cần thiết
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
    return NextResponse.json({}, { headers: corsHeaders });
};
export const PATCH = async (req: Request, { params }: { params: { storeId: string, orderId: string } }) => {
    try {
      const body = await req.json();
      const { order_status } = body;
  
      const orderRef = doc(db, "stores", params.storeId, "orders", params.orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        return new NextResponse("order not found", { status: 404, headers: corsHeaders });
      }
  
      await updateDoc(orderRef, {
        order_status
      });
  
      const updatedOrder = (await getDoc(orderRef)).data() as Orders;
      return NextResponse.json(updatedOrder, { headers: corsHeaders });
    } catch (error) {
      console.error(`order_PATCH_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
    }
  };
  export const DELETE = async (req: Request, { params }: { params: { storeId: string, orderId: string } }) => {
    try {
      if (!params.storeId || !params.orderId) {
        return new NextResponse("Store ID or order ID is missing", { status: 400, headers: corsHeaders });
      }

      // Check if store exists
      const storeRef = doc(db, "stores", params.storeId);
      const store = await getDoc(storeRef);
      if (!store.exists()) {
        console.error(`Store with ID ${params.storeId} not found`);
        return new NextResponse("Store not found", { status: 404, headers: corsHeaders });
      }

      // Check if order exists
      const orderRef = doc(db, "stores", params.storeId, "orders", params.orderId);
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        console.error(`Order with ID ${params.orderId} not found`);
        return new NextResponse("Order not found", { status: 404, headers: corsHeaders });
      }

      // If images exist, attempt to delete them
      const images = orderDoc.data()?.images;
      if (images && Array.isArray(images)) {
        console.log(`Deleting ${images.length} images...`);
        await Promise.all(images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          try {
            await deleteObject(imageRef);
            console.log(`Deleted image at ${image.url}`);
          } catch (err) {
            console.error(`Failed to delete image at ${image.url}: ${err}`);
          }
        }));
      } else {
        console.log('No images found for deletion.');
      }

      // Delete the order document from Firestore
      await deleteDoc(orderRef);
      console.log(`Order ${params.orderId} deleted successfully.`);

      return NextResponse.json({ msg: "Order and images deleted successfully" }, { headers: corsHeaders });
    } catch (error) {
      console.error(`DELETE_order_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
    }
};
export const GET = async (req: Request, { params }: { params: { storeId: string, userId:string } }) => {
  try {
      const { storeId ,userId } = params;
  
      if (!storeId) {
          return new NextResponse('StoreId is Missing', { status: 400, headers: corsHeaders });
      }

     let orderQuery
      if (!userId) {
          return new NextResponse('userId is Missing', { status: 400, headers: corsHeaders });
      }

      // Nếu có `userId`, truy xuất đơn hàng của người dùng đó
       orderQuery = query(
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