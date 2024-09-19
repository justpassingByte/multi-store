
import React from 'react';

const OrderPage = async () => {
    // // Fetch order data
    // const orderDoc = await getDoc(
    //     doc(db, 'stores', params.storeId, 'orders', params.orderId)
    // );

    // const order = orderDoc.data() as Orders;

    // // Fetch all billboards
    // const billboardsSnapshot = await getDocs(
    //     collection(db, 'stores', params.storeId, 'orders')
    // );

    // // Map over Firestore documents and convert them to plain objects
    // const billboards = billboardsSnapshot.docs.map((doc) => ({
    //     id: doc.id, // Add the document ID
    //     ...doc.data(), // Spread the document data to make it a plain object
    // })) as Billboards[];

    // Ensure only plain objects are passed to the client component
    return (
        <div className="flex-col">
            Order
        </div>
    );
};

export default OrderPage;
