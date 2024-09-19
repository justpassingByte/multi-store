import { db } from "@/lib/firebase";
import { Sizes } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, sizeId: string } }) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      if (!params.storeId || !params.sizeId) {
        return new NextResponse("Store or size ID is missing", { status: 400 });
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
  
      const sizeRef = doc(db, "stores", params.storeId, "sizes", params.sizeId);
      const sizeDoc = await getDoc(sizeRef);
  
      if (!sizeDoc.exists()) {
        return new NextResponse("sizes not found", { status: 404 });
      }
  
      await updateDoc(sizeRef, {
        name,
        value,
        updateAt: serverTimestamp(),
      });
  
      const updatedSize = (await getDoc(sizeRef)).data() as Sizes;
      return NextResponse.json(updatedSize);
  
    } catch (error) {
      console.error(`SIZE_PATCH_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  

export const DELETE = async (req: Request, { params }: { params: { storeId: string, sizeId: string } }) => {
    try {
        // Get the authenticated user
        const { userId } = auth();
  
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
  
        if (!params.storeId) {
            return new NextResponse("Store ID is missing", { status: 400 });
        }
  
        if (!params.sizeId) {
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
        const sizeRef = doc(db, "stores", params.storeId, "sizes", params.sizeId);
  
        // Check if the size exists
        const size = await getDoc(sizeRef);
        if (!size.exists()) {
            return new NextResponse("size not found", { status: 404 });
        }
  
        // Delete the size
        await deleteDoc(sizeRef);
  
        return NextResponse.json({ msg: "size deleted successfully" });
  
    } catch (error) {
        console.error(`DELETE_SIZE_ERROR: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
