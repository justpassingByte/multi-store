import { db } from "@/lib/firebase"
import { Orders } from "@/type-db"
import { collection, doc, getDocs } from "firebase/firestore"

export const getTotalRevenue = async (storeId: string) => {
    const orderData = (
        (await getDocs(collection(doc(db, "stores", storeId), "orders"))).docs.map((doc) => doc.data() as Orders)
    )
    const paidOrders = orderData.filter((order)=> order.isPaid)
    const totalRevenue = paidOrders.reduce((total,order) => {
        const orderTotal = order.orderItems.reduce((orderSum,item) =>{
            if(item.qty !== undefined){
                return orderSum + item.price * item.qty;
            }else{
                return orderSum + item.price;
            }
        }, 0)
        return total + orderTotal
    },0)
    return totalRevenue
}