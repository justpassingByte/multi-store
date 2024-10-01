import { db } from "@/lib/firebase"
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalProducts = async (storeId:string) =>{
    const productData = await getDocs(collection(doc(db,"stores",storeId),"products"))
    const count = productData.size
    return count
}