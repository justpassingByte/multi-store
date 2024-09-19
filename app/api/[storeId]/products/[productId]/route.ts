import { db, storage } from "@/lib/firebase";
import { Products } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, and, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, productId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const body = await req.json();
    const { name, price, images, isFeatured, isArchieved, category, size, kitchen, cuisine } = body;

    // Validate incoming data
    if (!name || typeof price !== 'number' || !category || !images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("Required fields are missing or invalid", { status: 400 });
    }

    // Check if the store exists and the user has access
    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return new NextResponse("Unauthorized access", { status: 403 });
    }

    // Reference to the specific product document
    const productRef = doc(db, "stores", params.storeId, "products", params.productId);

    // Check if the product exists
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Update the product document
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
      updateAt: serverTimestamp()
    });

    // Return updated product data
    const updatedProduct = (await getDoc(productRef)).data() as Products;
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(`PRODUCT_PATCH_ERROR: ${error.message}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};


export const DELETE = async (req: Request, { params }: { params: { storeId: string, productId: string } }) => {
  try {
    // Get the authenticated user
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is missing", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("product ID is missing", { status: 400 });
    }

    // Get the store document
    const store = await getDoc(doc(db, "stores", params.storeId));

    if (!store.exists()) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const storeData = store.data();
    if (storeData?.userId !== userId) {
      return new NextResponse("Unauthorized access", { status: 403 });
    }

    // Reference to the specific product document
    const productRef = doc(db, "stores", params.storeId, "products", params.productId);

    // Check if the product exists
    const productDoc = await getDoc(productRef);
    if (!productDoc.exists()) {
      return new NextResponse("product not found", { status: 404 });
    }
    // Delete all product images
    const images = productDoc.data()?.images
    if (images && Array.isArray(images)) {
      await Promise.all(
        images.map(async (image) => {
          const imageRef = ref(storage, image.url);
          await deleteObject(imageRef)
        })
      )
    }
    // Delete the product
    await deleteDoc(productRef);

    return NextResponse.json({ msg: "product and product images deleted successfully" });

  } catch (error) {
    console.error(`DELETE_PRODUCT_ERROR: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
