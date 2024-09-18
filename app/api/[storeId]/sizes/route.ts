

import { SizesColumn } from "@/app/(dashboard)/[storeId]/(routes)/sizes/components/column";
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
          return new NextResponse("Size Name is Missing", { status: 400 });
        }
        if (!value) {
          return new NextResponse("Size value is Missing", { status: 400 });
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
        const sizeData = {
            name,
            value,
            createAt : serverTimestamp()
        }
        const sizeRef = await addDoc(
            collection(db,"stores",params.storeId,"sizes"),
            sizeData
        )
        const sizeId = sizeRef.id
        await updateDoc(doc(db,"stores",params.storeId,"sizes",sizeId),{
            ...sizeData,
            sizeId,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({sizeId,...sizeData})
      
      } catch (error) {
        console.log(`SIZE_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
      if (!params.storeId) {
        return new NextResponse('StoreId is Missing', { status: 400 });
      }
  
      const sizeSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'sizes'));
      const sizeData: SizesColumn[] = sizeSnapshot.docs.map(doc => ({
        id: doc.id, // Ensure you get the document ID
        ...doc.data() as Omit<SizesColumn, 'id'> 
      }));
  
      return NextResponse.json(sizeData);
    } catch (error) {
      console.log(`SIZE_GET: ${error}`);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };