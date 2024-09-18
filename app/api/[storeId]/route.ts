import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Store } from "@/type-db";

export const DELETE = async (req: Request,{params}: {params:{storeId:string}}) => {
  try {
    // Get the authenticated user
    const { userId } =  auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    if (!params.storeId) {
        return new NextResponse("StoreId required", { status: 403 });
      }
  
   
      // delete all the subcollections : image,...
    const docRef = doc(db,"stores",params.storeId)
    await deleteDoc(docRef)
    return NextResponse.json({msg:"Store deleted"})
  } catch (error) {
    console.log(`STORES_PATCH: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
export const PATCH = async (req: Request,{params}: {params:{storeId:string}}) => {
    try {
      // Get the authenticated user
      const { userId } =  auth();
  
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
  
      const docRef = doc(db,"stores",params.storeId)
      await updateDoc(docRef,{name})
      const store = ((await getDoc(docRef)).data() as Store)
      return NextResponse.json(store);
    } catch (error) {
      console.log(`STORES_PATCH: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  