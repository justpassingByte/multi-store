import { db } from "@/lib/firebase";
import { Products } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { addDoc, and, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const POST = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { 
      name, price, images, isFeature, isArchieve, category, 
      size, kitchen, cuisine, description, ingredients,
      calories, protein, carbs, fat 
    } = body;

    if (!name || typeof price !== 'number' || !category || !images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json("Required fields are missing or invalid", { status: 400, headers: corsHeaders });
    }

    const store = await getDoc(doc(db, "stores", params.storeId));
    if (!store.exists() || store.data()?.userId !== userId) {
      return NextResponse.json("Unauthorized access", { status: 403, headers: corsHeaders });
    }

    const productData = {
      name,
      price,
      images,
      isFeature,
      isArchieve,
      category,
      size,
      kitchen,
      cuisine,
      description,
      ingredients,
      calories,
      protein,
      carbs,
      fat,
      createAt: serverTimestamp(),
    };

    const productRef = await addDoc(collection(db, "stores", params.storeId, "products"), productData);
    const id = productRef.id;

    await updateDoc(doc(db, "stores", params.storeId, "products", id), {
      ...productData,
      id,
      updateAt: serverTimestamp(),
    });

    return NextResponse.json({ id, ...productData }, { headers: corsHeaders });
  } catch (error) {
    console.error(`PRODUCT_POST_ERROR: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    if (!params.storeId) {
      return NextResponse.json("Store Id is missing", { status: 400, headers: corsHeaders });
    }

    const { searchParams } = new URL(req.url);
    const productRef = collection(doc(db, "stores", params.storeId), "products");

    let productQuery;
    const queryConstraints = [];
    if (searchParams.has("size")) {
      queryConstraints.push(where("size", "==", searchParams.get("size")));
    }
    if (searchParams.has("category")) {
      queryConstraints.push(where("category", "==", searchParams.get("category")));
    }
    if (searchParams.has("kitchen")) {
      queryConstraints.push(where("kitchen", "==", searchParams.get("kitchen")));
    }
    if (searchParams.has("cuisine")) {
      queryConstraints.push(where("cuisine", "==", searchParams.get("cuisine")));
    }
  
    if (searchParams.has("isFeature")) {
      queryConstraints.push(where("isFeature", "==", searchParams.get("isFeature") === "true"));
    }
    if (searchParams.has("isArchieve")) {
      queryConstraints.push(where("isArchieve", "==", searchParams.get("isArchieve") === "true"));
    }
    if (searchParams.has("minCalories")) {
      queryConstraints.push(where("calories", ">=", parseInt(searchParams.get("minCalories")!)));
    }
    if (searchParams.has("maxCalories")) {
      queryConstraints.push(where("calories", "<=", parseInt(searchParams.get("maxCalories")!)));
    }
    if (searchParams.has("minProtein")) {
      queryConstraints.push(where("protein", ">=", parseInt(searchParams.get("minProtein")!)));
    }
    if (searchParams.has("maxProtein")) {
      queryConstraints.push(where("protein", "<=", parseInt(searchParams.get("maxProtein")!)));
    }
    if (queryConstraints.length > 0) {
      productQuery = query(productRef, and(...queryConstraints));
    } else {
      productQuery = query(productRef);
    }

    const querySnapshot = await getDocs(productQuery);
    const productData: Products[] = querySnapshot.docs.map(
      (doc) => doc.data() as Products
    );
    
    return NextResponse.json(productData, { headers: corsHeaders });
  } catch (error) {
    console.log(`PRODUCT_GET: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};
