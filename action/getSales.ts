import { db } from "@/lib/firebase"
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalSales = async (storeId:string) =>{
    const saleData = await getDocs(collection(doc(db,"stores",storeId),"orders"))
    const count = saleData.size
    return count
}