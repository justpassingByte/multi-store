import { db } from "@/lib/firebase";
import {  Categories } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, kitchenId: string } }) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      if (!params.storeId || !params.kitchenId) {
        return new NextResponse("Store or kitchen ID is missing", { status: 400 });
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
  
      const kitchenRef = doc(db, "stores", params.storeId, "kitchens", params.kitchenId);
      const kitchenDoc = await getDoc(kitchenRef);
  
      if (!kitchenDoc.exists()) {
        return new NextResponse("kitchens not found", { status: 404 });
      }
  
      await updateDoc(kitchenRef, {
        name,
        value,
        updateAt: serverTimestamp(),
      });
  
      const updatedKitchen = (await getDoc(kitchenRef)).data() as Categories;
      return NextResponse.json(updatedKitchen);
  
    } catch (error) {
      console.error(`KITCHEN_PATCH_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  

export const DELETE = async (req: Request, { params }: { params: { storeId: string, kitchenId: string } }) => {
    try {
        // Get the authenticated user
        const { userId } = auth();
  
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
  
        if (!params.storeId) {
            return new NextResponse("Store ID is missing", { status: 400 });
        }
  
        if (!params.kitchenId) {
            return new NextResponse("kitchen ID is missing", { status: 400 });
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
  
        // Reference to the specific kitchen document
        const kitchenRef = doc(db, "stores", params.storeId, "kitchens", params.kitchenId);
  
        // Check if the kitchen exists
        const kitchen = await getDoc(kitchenRef);
        if (!kitchen.exists()) {
            return new NextResponse("kitchen not found", { status: 404 });
        }
  
        // Delete the kitchen
        await deleteDoc(kitchenRef);
  
        return NextResponse.json({ msg: "kitchen deleted successfully" });
  
    } catch (error) {
        console.error(`DELETE_KITCHEN_ERROR: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
