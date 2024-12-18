import { db, storage } from "@/lib/firebase";
import { Combos } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () => {
  return NextResponse.json({}, { headers: corsHeaders });
};

// PATCH request handler - Update Combo
export const PATCH = async (req: Request, { params }: { params: { storeId: string; comboId: string } }) => {
  try {
    const body = await req.json();
    const { name, price, images, description, products } = body;

    if (!name || typeof price !== "number" || !images || !Array.isArray(images) || images.length === 0 || !products) {
      return NextResponse.json("Required fields are missing or invalid", { status: 400, headers: corsHeaders });
    }

    const comboRef = doc(db, "stores", params.storeId, "combos", params.comboId);
    const comboDoc = await getDoc(comboRef);
    if (!comboDoc.exists()) {
      return NextResponse.json("Combo not found", { status: 404, headers: corsHeaders });
    }

    await updateDoc(comboRef, {
      name,
      price,
      images,
      description,
      products,
      updateAt: serverTimestamp(),
    });

    const updatedCombo = (await getDoc(comboRef)).data() as Combos;
    return NextResponse.json(updatedCombo, { headers: corsHeaders });
  } catch (error) {
    console.error(`COMBO_PATCH_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

// DELETE request handler - Delete Combo and Images
export const DELETE = async (req: Request, { params }: { params: { storeId: string; comboId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }

    if (!params.storeId || !params.comboId) {
      return NextResponse.json("Store ID or Combo ID is missing", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return NextResponse.json("Unauthorized access", { status: 403, headers: corsHeaders });
    }

    const comboRef = doc(db, "stores", params.storeId, "combos", params.comboId);
    const comboDoc = await getDoc(comboRef);
    if (!comboDoc.exists()) {
      return NextResponse.json("Combo not found", { status: 404, headers: corsHeaders });
    }

    const images = comboDoc.data()?.images;
    if (images && Array.isArray(images)) {
      await Promise.all(images.map(async (image) => {
        const imageRef = ref(storage, image.url);
        await deleteObject(imageRef);
      }));
    }

    await deleteDoc(comboRef);
    return NextResponse.json({ msg: "Combo and images deleted successfully" }, { headers: corsHeaders });
  } catch (error) {
    console.error(`DELETE_COMBO_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

// GET request handler - Retrieve Combo by ID
export const GET = async (req: Request, { params }: { params: { storeId: string; comboId: string } }) => {
  try {
    const { storeId, comboId } = params;

    if (!storeId || !comboId) {
      return NextResponse.json("Store ID or Combo ID is missing", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", storeId));
    if (!store.exists()) {
      return NextResponse.json("Store not found", { status: 404, headers: corsHeaders });
    }

    const comboRef = doc(db, "stores", storeId, "combos", comboId);
    const comboDoc = await getDoc(comboRef);
    if (!comboDoc.exists()) {
      return NextResponse.json("Combo not found", { status: 404, headers: corsHeaders });
    }

    const comboData = comboDoc.data() as Combos;
    return NextResponse.json(comboData, { headers: corsHeaders });
  } catch (error) {
    console.error(`GET_COMBO_BY_ID_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};
