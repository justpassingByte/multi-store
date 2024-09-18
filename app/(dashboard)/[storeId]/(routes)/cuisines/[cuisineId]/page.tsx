import { db } from '@/lib/firebase';
import { Billboards, Cuisines } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import CuisineForm from './components/cuisine-form';

const CuisinePage = async ({
    params,
}: {
    params: { cuisineId: string; storeId: string; billboardId: string };
}) => {
    // Fetch Cuisine data
    const cuisineDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)
    );

    const cuisine = cuisineDoc.data() as Cuisines;

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
                {/* Pass the plain objects to CuisineForm */}              
                <CuisineForm initialData={cuisine} billboards={billboards} />           
            </div>
        </div>
    );
};

export default CuisinePage;
