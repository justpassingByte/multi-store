import { db} from "@/lib/firebase";
import { Products } from "@/type-db";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};
export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { products, userId, orderedBy, orderType, ignoreWarning } = await req.json();

    // Create line_items array
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((item: Products) => ({
      quantity: item.qty,
      price_data: {
        currency: "USD",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
    }));

    // Tạo orderData với thêm thông tin về loại đơn hàng
    const orderData = {
      isPaid: false,
      orderItems: products,
      userId, // ID người nhận đơn hàng
      orderedBy: orderType === 'RELATIVE' ? orderedBy : userId, // ID người đặt hàng
      orderType, // 'SELF' hoặc 'RELATIVE'
      order_status: "Processing",
      ignoreNutritionWarning: ignoreWarning || false, // Chỉ có ý nghĩa với orderType = 'RELATIVE'
      createAt: serverTimestamp(),
    }

    // Lưu đơn hàng vào Firestore
    const orderRef = await addDoc(collection(db, "stores", params.storeId, "orders"), orderData)
    const id = orderRef.id
    await updateDoc(doc(db, "stores", params.storeId, "orders", id), {
      ...orderData,
      id,
      updateAt: serverTimestamp()
    })

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CN", "JP", "VN", "AU"]
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
      metadata: {
        orderId: id,
        userId,
        orderedBy: orderType === 'RELATIVE' ? orderedBy : userId,
        orderType,
        storeId: params.storeId,
      },
    });

    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("Stripe Checkout Session Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};