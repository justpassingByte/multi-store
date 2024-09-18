import { db } from "@/lib/firebase";
import { Billboards, Categories, Cuisines } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, cuisineId: string } }) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      if (!params.storeId || !params.cuisineId) {
        return new NextResponse("Store or cuisine ID is missing", { status: 400 });
      }
  
      const body = await req.json();
      const { name, value } = body;
  
      if (!name || !value ){
        return new NextResponse("Required fields are missing", { status: 400 });
      }
  
      const storeDoc = await getDoc(doc(db, "stores", params.storeId));
      if (!storeDoc.exists()) {
        return new NextResponse("Store not found", { status: 404 });
      }
  
      const storeData = storeDoc.data();
      if (storeData?.userId !== userId) {
        return new NextResponse("Unauthorized access", { status: 403 });
      }
  
      const cuisineRef = doc(db, "stores", params.storeId, "cuisines", params.cuisineId);
      const cuisineDoc = await getDoc(cuisineRef);
  
      if (!cuisineDoc.exists()) {
        return new NextResponse("cuisines not found", { status: 404 });
      }
  
      await updateDoc(cuisineRef, {
        name,
        value,
        updateAt: serverTimestamp(),
      });
  
      const updatedCuisine = (await getDoc(cuisineRef)).data() as Cuisines;
      return NextResponse.json(updatedCuisine);
  
    } catch (error) {
      console.error(`CUISINE_PATCH_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  

export const DELETE = async (req: Request, { params }: { params: { storeId: string, cuisineId: string } }) => {
    try {
        // Get the authenticated user
        const { userId } = auth();
  
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
  
        if (!params.storeId) {
            return new NextResponse("Store ID is missing", { status: 400 });
        }
  
        if (!params.cuisineId) {
            return new NextResponse("Size ID is missing", { status: 400 });
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
  
        // Reference to the specific size document
        const cuisineRef = doc(db, "stores", params.storeId, "cuisines", params.cuisineId);
  
        // Check if the size exists
        const cuisine = await getDoc(cuisineRef);
        if (!cuisine.exists()) {
            return new NextResponse("cuisine not found", { status: 404 });
        }
  
        // Delete the cuisine
        await deleteDoc(cuisineRef);
  
        return NextResponse.json({ msg: "cuisine deleted successfully" });
  
    } catch (error) {
        console.error(`DELETE_CUISINE_ERROR: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
