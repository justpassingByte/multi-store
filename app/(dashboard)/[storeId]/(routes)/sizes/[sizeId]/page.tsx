import { db } from '@/lib/firebase';
import {  Sizes } from '@/type-db';
import {  doc, getDoc} from 'firebase/firestore';
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

    // Ensure only plain objects are passed to the client component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Pass the plain objects to SizeForm */}              
                <SizeForm initialData={size} />           
            </div>
        </div>
    );
};

export default SizePage;
