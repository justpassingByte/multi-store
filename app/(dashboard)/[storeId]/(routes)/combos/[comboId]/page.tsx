import { db } from '@/lib/firebase';
import { Combos, Products } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import ComboForm from './components/combo-form';

const ComboPage = async ({
    params,
}: {
    params: { comboId: string; storeId: string };
}) => {
    // Fetch combo data
    const comboDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'combos', params.comboId)
    );

    const combos = comboDoc.data() as Combos[];

    // Fetch all products within the combo
    const productsSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'products')
    );

    const products = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Products[];

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ComboForm 
                    initialData={combos} 
                    products={products} 
                />           
            </div>
        </div>
    );
};

export default ComboPage;
