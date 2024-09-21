import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Store } from "@/type-db";
import { deleteObject, ref } from "firebase/storage";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const DELETE = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }
    if (!params.storeId) {
      return NextResponse.json("StoreId required", { status: 403, headers: corsHeaders });
    }

    // Delete all the subcollections
    const billboardsSnapshot = await getDocs(collection(db, `stores/${params.storeId}/billboards`));
    await Promise.all(billboardsSnapshot.docs.map(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref);
      const imageUrl = billboardDoc.data().imageUrl;
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      }
    }));

    const collections = ['categories', 'sizes', 'kitchens', 'cuisines', 'products', 'orders'];
    await Promise.all(collections.map(async (collectionName) => {
      const snapshot = await getDocs(collection(db, `stores/${params.storeId}/${collectionName}`));
      return Promise.all(snapshot.docs.map(async (doc) => {
        await deleteDoc(doc.ref);
        if (collectionName === 'products') {
          const imagesArray = doc.data().images;
          if (imagesArray && Array.isArray(imagesArray)) {
            await Promise.all(imagesArray.map(async (image) => {
              const imageRef = ref(storage, image.url);
              await deleteObject(imageRef);
            }));
          }
        }
        if (collectionName === 'orders') {
          const orderItemArray = doc.data().orderItems;
          if (orderItemArray && Array.isArray(orderItemArray)) {
            await Promise.all(orderItemArray.map(async () => {
              const imagesArray = doc.data().images;
              if (imagesArray && Array.isArray(imagesArray)) {
                await Promise.all(imagesArray.map(async (image) => {
                  const imageRef = ref(storage, image.url);
                  await deleteObject(imageRef);
                }));
              }
            }));
          }
        }
      }));
    }));

    const docRef = doc(db, "stores", params.storeId);
    await deleteDoc(docRef);
    return NextResponse.json({ msg: "Store deleted" }, { headers: corsHeaders });
  } catch (error) {
    console.log(`STORES_DELETE: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};

export const PATCH = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json("Unauthorized", { status: 403, headers: corsHeaders });
    }
    if (!params.storeId) {
      return NextResponse.json("StoreId required", { status: 403, headers: corsHeaders });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json("Store Name is Missing", { status: 400, headers: corsHeaders });
    }

    const docRef = doc(db, "stores", params.storeId);
    await updateDoc(docRef, { name });
    const store = (await getDoc(docRef)).data() as Store;
    return NextResponse.json(store, { headers: corsHeaders });
  } catch (error) {
    console.log(`STORES_PATCH: ${error}`);
    return NextResponse.json("Internal Server Error", { status: 500, headers: corsHeaders });
  }
};
