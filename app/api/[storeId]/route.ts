import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { Store } from "@/type-db";
import { deleteObject, ref } from "firebase/storage";

export const DELETE = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    // Get the authenticated user
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!params.storeId) {
      return new NextResponse("StoreId required", { status: 403 });
    }


    // delete all the subcollections : 

    // bill board and image
    const billboardsSnapshot = await getDocs(collection(db, `stores/${params.storeId}/billboards`))
    billboardsSnapshot.forEach(async (billboardDoc) => {
      await deleteDoc(billboardDoc.ref)
      const imageUrl = billboardDoc.data().imageUrl
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl)
        await deleteObject(imageRef)
      }
    })
    // categories
    const categoriesSnapshot = await getDocs(collection(db, `stores/${params.storeId}/categories`))
    categoriesSnapshot.forEach(async (categoryDoc) => {
      await deleteDoc(categoryDoc.ref)
    })
    //sizes
    const sizesSnapshot = await getDocs(collection(db, `stores/${params.storeId}/sizes`))
    sizesSnapshot.forEach(async (sizeDoc) => {
      await deleteDoc(sizeDoc.ref)
    })
    //kitchens
    const kitchensSnapshot = await getDocs(collection(db, `stores/${params.storeId}/kitchens`))
    kitchensSnapshot.forEach(async (kitchenDoc) => {
      await deleteDoc(kitchenDoc.ref)
    })
    //cuisines
    const cuisinesSnapshot = await getDocs(collection(db, `stores/${params.storeId}/cuisines`))
    cuisinesSnapshot.forEach(async (cuisineDoc) => {
      await deleteDoc(cuisineDoc.ref)
    })
    //products and image
    const productsSnapshot = await getDocs(collection(db, `stores/${params.storeId}/products`))
    productsSnapshot.forEach(async (productDoc) => {
      await deleteDoc(productDoc.ref)
      const imagesArray = productDoc.data().images
      if (imagesArray && Array.isArray(imagesArray)) {
        imagesArray.map(async (image) => {
          const imageRef = ref(storage, image.url)
          await deleteObject(imageRef)
        })
      }
    })
    //order and product image
    const ordersSnapshot = await getDocs(collection(db, `stores/${params.storeId}/orders`))
    ordersSnapshot.forEach(async (orderDoc) => {
      await deleteDoc(orderDoc.ref)
      const orderItemArray = orderDoc.data().orderItems
      if (orderItemArray && Array.isArray(orderItemArray)) {
        await Promise.all(
          orderItemArray.map(async (orderItem) => {
            const imagesArray = orderDoc.data().images
            if (imagesArray && Array.isArray(imagesArray)) {
              imagesArray.map(async (image) => {
                const imageRef = ref(storage, image.url)
                await deleteObject(imageRef)
              })
            }
          })
        )
      }
    })

    const docRef = doc(db, "stores", params.storeId)
    await deleteDoc(docRef)
    return NextResponse.json({ msg: "Store deleted" })
  } catch (error) {
    console.log(`STORES_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
export const PATCH = async (req: Request, { params }: { params: { storeId: string } }) => {
  try {
    // Get the authenticated user
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!params.storeId) {
      return new NextResponse("StoreId required", { status: 403 });
    }

    // Parse the request body
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Store Name is Missing", { status: 400 });
    }

    const docRef = doc(db, "stores", params.storeId)
    await updateDoc(docRef, { name })
    const store = ((await getDoc(docRef)).data() as Store)
    return NextResponse.json(store);
  } catch (error) {
    console.log(`STORES_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
