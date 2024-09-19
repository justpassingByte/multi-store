import { db } from '@/lib/firebase';
import {  Cuisines } from '@/type-db';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import CuisineForm from './components/cuisine-form';

const CuisinePage = async ({
    params,
}: {
    params: { cuisineId: string; storeId: string };
}) => {
    // Fetch Cuisine data
    const cuisineDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'cuisines', params.cuisineId)
    );

    const cuisine = cuisineDoc.data() as Cuisines;
    // Ensure only plain objects are passed to the client component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Pass the plain objects to CuisineForm */}              
                <CuisineForm initialData={cuisine} />           
            </div>
        </div>
    );
};

export default CuisinePage;
