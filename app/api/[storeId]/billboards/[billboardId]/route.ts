import { db } from "@/lib/firebase";
import { Billboards } from "@/type-db";
import { auth } from "@clerk/nextjs/server";
import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request, {params}: {params:{storeId: string, billboardId:string }}) =>{
    try {
        // Get the authenticated user
        const { userId } =  auth();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 403 });
        }
        if (!params.storeId) {
            return new NextResponse("Store id is missing", { status: 400 });
          }
    
        if (!params.billboardId) {
            return new NextResponse("Bill board id is missing", { status: 400 });
          }
      
       // Parse the request body
        const body = await req.json();
        const { label, imageUrl } = body;
    
        if (!label) {
          return new NextResponse("Bill board Name is Missing", { status: 400 });
        }
        if(!imageUrl){
            return new NextResponse("Bill board Image is Missing", { status: 400 });
        }
        if(!params.storeId){
            return new NextResponse("StoreId is Missing", { status: 400 });
        }
        const store = await getDoc(doc(db,"stores", params.storeId))

        if (store.exists()){
            const storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authourized access",{status:400})
            }
        }
        
       const billboardRef = await getDoc(doc(db,"stores",params.storeId,"billboards",params.billboardId))
       if(billboardRef.exists()){
            await updateDoc(doc(db,"stores",params.storeId,"billboards",params.billboardId),{
                ...billboardRef.data(),
                imageUrl,
                label,
                updateAt: serverTimestamp()
            })
       }else{
        return new NextResponse("Bill board not found",{status:404})
       }
       const billboard = (
        await getDoc(doc(db,"stores", params.storeId,"billboards",params.billboardId)) 
       ).data() as Billboards

       return NextResponse.json(billboard)

      } catch (error) {
        console.log(`STORE_PATCH: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const DELETE = async (req: Request, { params }: { params: { storeId: string, billboardId: string } }) => {
  try {
      // Get the authenticated user
      const { userId } = auth();

      if (!userId) {
          return new NextResponse("Unauthorized", { status: 403 });
      }

      if (!params.storeId) {
          return new NextResponse("Store ID is missing", { status: 400 });
      }

      if (!params.billboardId) {
          return new NextResponse("Billboard ID is missing", { status: 400 });
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

      // Reference to the specific billboard document
      const billboardRef = doc(db, "stores", params.storeId, "billboards", params.billboardId);

      // Delete the billboard
      await deleteDoc(billboardRef);

      return NextResponse.json({ msg: "Billboard deleted successfully" });

  } catch (error) {
      console.error(`DELETE_BILLBOARD_ERROR: ${error}`);
      return new NextResponse("Internal Server Error", { status: 500 });
  }
};
