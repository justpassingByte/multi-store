import { BillBoardColumn } from "@/app/(dashboard)/[storeId]/(routes)/billboards/components/column";
import { db } from "@/lib/firebase";
import { Billboards } from "@/type-db";
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
            let storeData = store.data()
            if(storeData?.userId !== userId){
                return new NextResponse("Un-Authourized access",{status:400})
            }
        }
        const billboardData = {
            label,
            imageUrl,
            createAt : serverTimestamp()
        }
        const billboardRef = await addDoc(
            collection(db,"stores",params.storeId,"billboards"),
            billboardData
        )
        const billBoardId = billboardRef.id;
        await updateDoc(doc(db,"stores",params.storeId,"billboards",billBoardId),{
            ...billboardData,
            billBoardId,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({billBoardId,...billboardData})
      
      } catch (error) {
        console.log(`STORE_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
      if (!params.storeId) {
        return new NextResponse('StoreId is Missing', { status: 400 });
      }
  
      const billboardSnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'billboards'));
      const billboardData: BillBoardColumn[] = billboardSnapshot.docs.map(doc => ({
        id: doc.id, // Ensure you get the document ID
        ...doc.data() as Omit<BillBoardColumn, 'id'> // Spread remaining data
      }));
  
      return NextResponse.json(billboardData);
    } catch (error) {
      console.log(`STORE_POST: ${error}`);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };