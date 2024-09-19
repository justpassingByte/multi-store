import { db } from "@/lib/firebase";
import {  Categories } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, { params }: { params: { storeId: string, categoryId: string } }) => {
    try {
      const { userId } = auth();
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      if (!params.storeId || !params.categoryId) {
        return new NextResponse("Store or category ID is missing", { status: 400 });
      }
  
      const body = await req.json();
      const { name, billboardId, billboardLabel } = body;
  
      if (!name || !billboardId || !billboardLabel) {
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
  
      const categoryRef = doc(db, "stores", params.storeId, "categories", params.categoryId);
      const categoryDoc = await getDoc(categoryRef);
  
      if (!categoryDoc.exists()) {
        return new NextResponse("Category not found", { status: 404 });
      }
  
      await updateDoc(categoryRef, {
        name,
        billboardId,
        billboardLabel,
        updateAt: serverTimestamp(),
      });
  
      const updatedCategory = (await getDoc(categoryRef)).data() as Categories;
      return NextResponse.json(updatedCategory);
  
    } catch (error) {
      console.error(`CATEGORY_PATCH_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  

export const DELETE = async (req: Request, { params }: { params: { storeId: string, categoryId: string } }) => {
    try {
        // Get the authenticated user
        const { userId } = auth();
  
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }
  
        if (!params.storeId) {
            return new NextResponse("Store ID is missing", { status: 400 });
        }
  
        if (!params.categoryId) {
            return new NextResponse("Category ID is missing", { status: 400 });
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
  
        // Reference to the specific category document
        const categoryRef = doc(db, "stores", params.storeId, "categories", params.categoryId);
  
        // Check if the category exists
        const category = await getDoc(categoryRef);
        if (!category.exists()) {
            return new NextResponse("Category not found", { status: 404 });
        }
  
        // Delete the category
        await deleteDoc(categoryRef);
  
        return NextResponse.json({ msg: "Category deleted successfully" });
  
    } catch (error) {
        console.error(`DELETE_CATEGORY_ERROR: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
