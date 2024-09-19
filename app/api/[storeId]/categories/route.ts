
import { CategoriesColumn } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/column";
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
        const { name, billboardId, billboardLabel } = body;
    
        if (!name) {
          return new NextResponse("Category Name is Missing", { status: 400 });
        }
        if(!billboardId){
            return new NextResponse("Bill board Id is Missing", { status: 400 });
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
        const categoryData = {
            name,
            billboardId,
            billboardLabel,
            createAt : serverTimestamp()
        }
        const categoryRef = await addDoc(
            collection(db,"stores",params.storeId,"categories"),
            categoryData
        )
        const categoryId = categoryRef.id
        await updateDoc(doc(db,"stores",params.storeId,"categories",categoryId),{
            ...categoryData,
            categoryId,
            updateAt: serverTimestamp()
        })
        return NextResponse.json({categoryId,...categoryData})
      
      } catch (error) {
        console.log(`CATEGORY_POST: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
}

export const GET = async (req: Request, { params }: { params: { storeId: string } }) => {
    try {
      if (!params.storeId) {
        return new NextResponse('StoreId is Missing', { status: 400 });
      }
  
      const categorySnapshot = await getDocs(collection(doc(db, 'stores', params.storeId), 'categories'));
      const categoryData: CategoriesColumn[] = categorySnapshot.docs.map(doc => ({
        id: doc.id, // Ensure you get the document ID
        ...doc.data() as Omit<CategoriesColumn, 'id'> 
      }));
  
      return NextResponse.json(categoryData);
    } catch (error) {
      console.log(`CATEGORY_GET: ${error}`);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };