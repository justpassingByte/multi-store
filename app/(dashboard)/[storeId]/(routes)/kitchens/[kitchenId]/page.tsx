import { db } from '@/lib/firebase';
import { Billboards, Kitchens } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import KitchenForm from './components/kitchen-form';

const KitchenPage = async ({
    params,
}: {
    params: { kitchenId: string; storeId: string; billboardId: string };
}) => {
    // Fetch Kitchen data
    const kitchenDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'kitchens', params.kitchenId)
    );

    const kitchen = kitchenDoc.data() as Kitchens;

    // Fetch all billboards
    const billboardsSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'billboards')
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
                {/* Pass the plain objects to KitchenForm */}              
                <KitchenForm initialData={kitchen} billboards={billboards} />           
            </div>
        </div>
    );
};

export default KitchenPage;
