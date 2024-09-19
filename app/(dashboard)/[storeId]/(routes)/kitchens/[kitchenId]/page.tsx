import { db } from '@/lib/firebase';
import {  Kitchens } from '@/type-db';
import {  doc, getDoc } from 'firebase/firestore';
import React from 'react';
import KitchenForm from './components/kitchen-form';

const KitchenPage = async ({
    params,
}: {
    params: { kitchenId: string; storeId: string };
}) => {
    // Fetch Kitchen data
    const kitchenDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'kitchens', params.kitchenId)
    );

    const kitchen = kitchenDoc.data() as Kitchens;


    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Pass the plain objects to KitchenForm */}              
                <KitchenForm initialData={kitchen}  />           
            </div>
        </div>
    );
};

export default KitchenPage;
