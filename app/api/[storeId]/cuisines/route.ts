

import { CuisinesColumn } from "@/app/(dashboard)/[storeId]/(routes)/cuisines/components/column";
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
          return new NextResponse("Cuisine Name is Missing", { status: 400 });
        }
        if (!value) {
          return new NextResponse("Cuisine value is Missing", { status: 400 });
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
        const cuisineData = {
            name,
            value,
            createAt : serverTimestamp()
        }
        const cuisineRef = await addDoc(
            collection(db,"stores",params.storeId,"cuisines"),
            cuisineData
        )
        const cuisineId = cuisineRef.id
        await updateDoc(doc(db,"stores",params.storeId,"cuisines",cuisineId),{
            ...cuisineData,
            cuisineId,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({cuisineId,...cuisineData})
      
      } catch (error) {
        console.log(`Cuisine_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
      if (!params.storeId) {
        return new NextResponse('StoreId is Missing', { status: 400 });
      }
  
      const cuisineSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'cuisines'));
      const cuisineData: CuisinesColumn[] = cuisineSnapshot.docs.map(doc => ({
        id: doc.id, // Ensure you get the document ID
        ...doc.data() as Omit<CuisinesColumn, 'id'> 
      }));
  
      return NextResponse.json(cuisineData);
    } catch (error) {
      console.log(`Cuisine_GET: ${error}`);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };