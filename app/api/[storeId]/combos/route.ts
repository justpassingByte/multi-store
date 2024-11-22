import { CombosColumn } from "@/app/(dashboard)/[storeId]/(routes)/combos/components/column";
import { db } from "@/lib/firebase";
import { Combos } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,

  getDocs,

  serverTimestamp,
  updateDoc,

} from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// POST API to add a new combo
export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { name, price, images, products, description } = body;

    // Validate required fields
    if (!name || typeof price !== 'number' || !images || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json("Required fields are missing or invalid", { status: 400, headers: corsHeaders });
    }

    // Check store ownership
    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return NextResponse.json("Unauthorized access", { status: 403, headers: corsHeaders });
    }

    // Prepare combo data
    const comboData = {
      name,
      price,
      images,
      products,
      description,
      createdAt: serverTimestamp(),
    };

    // Add combo document
    const comboRef = await addDoc(collection(db, "stores", params.storeId, "combos"), comboData);

    // Update combo with its ID
    const id = comboRef.id;
    await updateDoc(doc(db, "stores", params.storeId, "combos", id), {
      id,
      updateAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...comboData }, { headers: corsHeaders });
  } catch (error) {
    console.error(`COMBO_POST_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};
export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { storeId } = params;

    if (!storeId) {
      return NextResponse.json("Store ID is missing", { status: 400, headers: corsHeaders });
    }

    // Fetch store document to verify the store exists
    const store = await getDoc(doc(db, "stores", storeId));
    if (!store.exists()) {
      return NextResponse.json("Store not found", { status: 404, headers: corsHeaders });
    }

    // Fetch all combos for the given storeId
    const combosRef = collection(db, "stores", storeId, "combos");
    const comboSnapshot = await getDocs(combosRef);

    if (comboSnapshot.empty) {
      return NextResponse.json("No combos found for this store", { status: 404, headers: corsHeaders });
    }

    // Map the combo documents to the expected data format
    const comboData = comboSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(comboData, { headers: corsHeaders });
  } catch (error) {
    console.error(`GET_COMBO_BY_ID_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

