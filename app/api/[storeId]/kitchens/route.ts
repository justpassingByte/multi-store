

import { KitchensColumn } from "@/app/(dashboard)/[storeId]/(routes)/kitchens/components/column";
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";


export const POST = async (req: Request, {params}: {params:{storeId: string}}) =>{
    try {
        // Get the authenticated user
        const { userId } =  auth();
    
        if (!userId) {
          return new NextResponse("Unauthorized", { status: 403 });
        }
    
        // Parse the request body
        const body = await req.json();
        const { name, value } = body;
    
        if (!name) {
          return new NextResponse("kitchen Name is Missing", { status: 400 });
        }
        if (!value) {
          return new NextResponse("kitchen value is Missing", { status: 400 });
        }
        if(!params.storeId){
            return new NextResponse("StoreId is Missing", { status: 400 });
        }
        const store = await getDoc(doc(db,"stores", params.storeId))

        if (store.exists()){
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authourized access",{status:400})
            }
        }
        const kitchenData = {
            name,
            value,
            createAt : serverTimestamp()
        }
        const kitchenRef = await addDoc(
            collection(db,"stores",params.storeId,"kitchens"),
            kitchenData
        )
        const kitchenId = kitchenRef.id
        await updateDoc(doc(db,"stores",params.storeId,"kitchens",kitchenId),{
            ...kitchenData,
            kitchenId,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({kitchenId,...kitchenData})
      
      } catch (error) {
        console.log(`KITCHEN_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
      if (!params.storeId) {
        return new NextResponse('StoreId is Missing', { status: 400 });
      }
  
      const kitchenSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'kitchens'));
      const kitchenData: KitchensColumn[] = kitchenSnapshot.docs.map(doc => ({
        id: doc.id, // Ensure you get the document ID
        ...doc.data() as Omit<KitchensColumn, 'id'> 
      }));
  
      return NextResponse.json(kitchenData);
    } catch (error) {
      console.log(`KITCHEN_GET: ${error}`);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };