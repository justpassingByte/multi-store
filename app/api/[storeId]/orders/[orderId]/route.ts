import { db } from "@/lib/firebase";
import { Orders } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request, 
    { params }: { params: { storeId: string, orderId: string } }
  ) => {
   
    try {
      const { storeId, orderId } = params;
  
      if (!storeId || !orderId) {
        return new NextResponse("Store ID or order ID is missing", { status: 400 });
      }
  
      // Get the store document to check access
      const store = await getDoc(doc(db, "stores", storeId));
      if (!store.exists()) {
        return new NextResponse("Store not found", { status: 404 });
      }
  
      // Reference to the specific order document
      const orderRef = doc(db, "stores", storeId, "orders", orderId);
  
      // Fetch the order document
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        return new NextResponse("order not found", { status: 404 });
      }
  
      // Return the order data
      const orderData = orderDoc.data() as Orders;
      return NextResponse.json(orderData);
    } catch (error) {
      console.error(`GET_ORDER_BY_ID_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  export const PATCH = async (
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) => {
    try {
        const { userId } = auth();
        const body = await req.json();

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 400 });
        }

        const { order_status } = body;

        if (!order_status) {
            return new NextResponse("Order Status is required", { status: 400 });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!params.orderId) {
            return new NextResponse("Order is required", { status: 400 });
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if (store.exists()) {
            const storeData = store.data();
            if (storeData?.userId !== userId) {
                return new NextResponse("Unauthorized Access", { status: 403 });
            }
        }

        const orderRef = await getDoc(
            doc(db, "stores", params.storeId, "orders", params.orderId)
        );

        if (orderRef.exists()) {
            await updateDoc(
                doc(db, "stores", params.storeId, "orders", params.orderId),
                {
                    ...orderRef.data(),
                    order_status,
                    updatedAt: serverTimestamp(),
                }
            );
        } else {
            return new NextResponse("Order Not Found", { status: 404 });
        }

        const order = (
            await getDoc(doc(db, "stores", params.storeId, "orders", params.orderId))
        ).data() as Orders;

        return NextResponse.json(order);
    } catch (error) {
        console.log(`[STORE_PATCH] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const DELETE = async (
    req: Request,
    { params }: { params: { storeId: string; orderId: string } }
) => {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400 });
        }

        if (!params.orderId) {
            return new NextResponse("Order is required", { status: 400 });
        }

        const store = await getDoc(doc(db, "stores", params.storeId));

        if (store.exists()) {
            const storeData = store.data();
            if (storeData?.userId !== userId) {
                return new NextResponse("Unauthorized Access", { status: 403 });
            }
        }

        const docRef = doc(db, "stores", params.storeId, "orders", params.orderId);

        await deleteDoc(docRef);

        return NextResponse.json({ msg: "Order Deleted" });
    } catch (error) {
        console.log(`[ORDER_DELETE] : ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};    