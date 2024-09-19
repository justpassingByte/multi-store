import { db } from '@/lib/firebase';
import { Billboards, Categories } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import CategoryForm from './components/category-form';

const CategoryPage = async ({
    params,
}: {
    params: { categoryId: string; storeId: string; billboardId: string };
}) => {
    // Fetch category data
    const categoryDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'categories', params.categoryId)
    );

    const category = categoryDoc.data() as Categories;

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
                {/* Pass the plain objects to CategoryForm */}              
                <CategoryForm initialData={category} billboards={billboards} />           
            </div>
        </div>
    );
};

export default CategoryPage;
