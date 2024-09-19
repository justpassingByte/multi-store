import { db } from '@/lib/firebase';
import { Billboards, Categories, Orders, Sizes } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import OrderForm from './components/order-form';


const OrderPage = async ({
    params,
}: {
    params: { orderId: string; storeId: string; billboardId: string };
}) => {
    // Fetch order data
    const orderDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'orders', params.orderId)
    );

    const order = orderDoc.data() as Orders;

    // Fetch all billboards
    const billboardsSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'orders')
    );

    // Map over Firestore documents and convert them to plain objects
    const billboards = billboardsSnapshot.docs.map((doc) => ({
        id: doc.id, // Add the document ID
        ...doc.data(), // Spread the document data to make it a plain object
    })) as Billboards[];

    // Ensure only plain objects are passed to the client component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Pass the plain objects to orderForm */}              
                <OrderForm initialData={order} billboards={billboards} />           
            </div>
        </div>
    );
};

export default OrderPage;
