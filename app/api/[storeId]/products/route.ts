

import { db } from "@/lib/firebase";
import { Products } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, and, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, price, images, isFeatured, isArchieved, category, size, kitchen, cuisine } = body;

    if (!name || typeof price !== 'number' || !category || !images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("Required fields are missing or invalid", { status: 400 });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Unauthorized access", { status: 403 });
    }

    const productData = {
      name,
      price,
      images,
      isFeatured: isFeatured || false,
      isArchieved: isArchieved || false,
      category,
      size,
      kitchen,
      cuisine,
      createAt: serverTimestamp()
    };

    const productRef = await addDoc(collection(db, "stores", params.storeId, "products"), productData);
    const productId = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", productId), {
      ...productData,
      productId,
      updateAt: serverTimestamp()
    });

    return NextResponse.json({ productId, ...productData });
  } catch (error) {
    console.error(`PRODUCT_POST_ERROR:${error}`,);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  req: Request, { params }: { params: { storeId: string} }
) => {
  try {
    if (!params.storeId) {
      return new NextResponse("Store Id is missing", { status: 400 })
    }
    // query based on searchParams
    const { searchParams } = new URL(req.url)
    const productRef = collection(doc(db, "stores", params.storeId), "products")

    let productQuery
    const queryContrains = []
    if (searchParams.has("size")) {
      queryContrains.push(where("size", "==", searchParams.get("size")))
    }
    if (searchParams.has("category")) {
      queryContrains.push(where("category", "==", searchParams.get("category")))
    }
    if (searchParams.has("kitchen")) {
      queryContrains.push(where("kitchen", "==", searchParams.get("kitchen")))
    }
    if (searchParams.has("cuisine")) {
      queryContrains.push(where("cuisine", "==", searchParams.get("cuisine")))
    }
    if (searchParams.has("isFeature")) {
      queryContrains.push(where("isFeature", "==", searchParams.get("isFeature") === "true" ? true : false))
    }
    if (searchParams.has("isArchieve")) {
      queryContrains.push(where("isArchieve", "==", searchParams.get("isArchieve") === "true" ? true : false))
    }
    if(queryContrains.length > 0){
      productQuery = query(productRef, and(...queryContrains))
    }else{
      productQuery = query(productRef)
    }
    //execute query
    const querySnapshot = await getDocs(productQuery)
    const productData : Products[] = querySnapshot.docs.map(
      (doc) => doc.data() as Products
    )
    return NextResponse.json(productData)
  } catch (error) {
    console.log(`PRODUCT_GET:${error}`);
    return new NextResponse("Internal server error", { status: 500 })
  }
}