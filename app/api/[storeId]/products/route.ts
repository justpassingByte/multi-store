

import { ProductsColumn } from "@/app/(dashboard)/[storeId]/(routes)/products/components/column";

import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
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
    console.error(`PRODUCT_POST_ERROR: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};



export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    if (!params.storeId) {
      return new NextResponse('StoreId is Missing', { status: 400 });
    }

    const productSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'products'));
    const productData: ProductsColumn[] = productSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ProductsColumn, 'id'>
    }));

    return NextResponse.json(productData);
  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
};