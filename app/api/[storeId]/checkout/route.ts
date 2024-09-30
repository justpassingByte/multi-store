import { db, storage } from "@/lib/firebase";
import { Products } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";
import {stripe} from "@/lib/stripe";
import Stripe from "stripe";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const PATCH = async (req: Request, { params }: { params: { storeId: string, productId: string } }) => {
  try {
    const body = await req.json();
    const { name, price, images, isFeatured, isArchieved, category, size, kitchen, cuisine } = body;

    if (!name || typeof price !== "number" || !category || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json("Required fields are missing or invalid", { status: 400, headers: corsHeaders });
    }

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return NextResponse.json("Product not found", { status: 404, headers: corsHeaders });
    }

    await updateDoc(productRef, {
      name,
      price,
      images,
      isFeatured: isFeatured || false,
      isArchieved: isArchieved || false,
      category,
      size,
      kitchen,
      cuisine,
      updateAt: serverTimestamp(),
    });

    const updatedProduct = (await getDoc(productRef)).data() as Products;
    return NextResponse.json(updatedProduct, { headers: corsHeaders });
  } catch (error) {
    console.error(`PRODUCT_PATCH_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string, productId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }

    if (!params.storeId) {
      return NextResponse.json("Store ID is missing", { status: 400, headers: corsHeaders });
    }

    if (!params.productId) {
      return NextResponse.json("Product ID is missing", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists()) {
      return NextResponse.json("Store not found", { status: 404, headers: corsHeaders });
    }

    const storeData = store.data();
    if (storeData?.userId !== userId) {
      return NextResponse.json("Unauthorized access", { status: 403, headers: corsHeaders });
    }

    const productRef = doc(db, "stores", params.storeId, "products", params.productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return NextResponse.json("Product not found", { status: 404, headers: corsHeaders });
    }

    const images = productDoc.data()?.images;
    if (images && Array.isArray(images)) {
      await Promise.all(images.map(async (image) => {
        const imageRef = ref(storage, image.url);
        await deleteObject(imageRef);
      }));
    }

    await deleteDoc(productRef);
    return NextResponse.json({ msg: "Product and product images deleted successfully" }, { headers: corsHeaders });
  } catch (error) {
    console.error(`DELETE_PRODUCT_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string, productId: string } }
) => {
  try {
    const { storeId, productId } = params;

    if (!storeId || !productId) {
      return NextResponse.json("Store ID or Product ID is missing", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", storeId));
    if (!store.exists()) {
      return NextResponse.json("Store not found", { status: 404, headers: corsHeaders });
    }

    const productRef = doc(db, "stores", storeId, "products", productId);
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return NextResponse.json("Product not found", { status: 404, headers: corsHeaders });
    }

    const productData = productDoc.data() as Products;
    return NextResponse.json(productData, { headers: corsHeaders });
  } catch (error) {
    console.error(`GET_PRODUCT_BY_ID_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { products, userId } = await req.json();

    // Create line_items array
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((item: Products) => ({
      quantity: item.qty,
      price_data: {
        currency: "USD",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert price to cents
      },
    }));

    const orderData = {
      isPaid: false,
      orderItems: products,
      userId,
      order_status:"Processing",
      createAt: serverTimestamp(),
    }
    const orderRef = await addDoc(collection(db,"stores",params.storeId,"orders"),orderData)
    const id = orderRef.id
    await updateDoc(doc(db,"stores",params.storeId,"orders",id),{
      ...orderData,
      id,
      updateAt:serverTimestamp()
    }
  )
  // Create a Stripe Checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    billing_address_collection:"required",
    shipping_address_collection:{
      allowed_countries:["US","CN","JP","VN","AU"]
    },
    phone_number_collection:{
      enabled:true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancel=1`,
    metadata: {
      userId,
      storeId: params.storeId,
    },
  });
    // Return the session URL
    return NextResponse.json({ url: session.url },{headers:corsHeaders});
  } catch (error) {
    console.error("Stripe Checkout Session Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};