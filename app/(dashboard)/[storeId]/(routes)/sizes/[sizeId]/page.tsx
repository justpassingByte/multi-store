import { db } from '@/lib/firebase';
import { Billboards, Categories, Sizes } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import SizeForm from './components/size-form';

const SizePage = async ({
    params,
}: {
    params: { sizeId: string; storeId: string; billboardId: string };
}) => {
    // Fetch Size data
    const SizeDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'sizes', params.sizeId)
    );

    const size = SizeDoc.data() as Sizes;

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
                {/* Pass the plain objects to SizeForm */}              
                <SizeForm initialData={size} billboards={billboards} />           
            </div>
        </div>
    );
};

export default SizePage;
