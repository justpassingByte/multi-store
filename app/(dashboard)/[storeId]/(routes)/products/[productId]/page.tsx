import { db } from '@/lib/firebase';
import { Billboards, Categories, Cuisines, Kitchens, Products, Sizes } from '@/type-db';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import React from 'react';
import ProductForm from './components/product-form';

const ProductPage = async ({
    params,
}: {
    params: { productId: string; storeId: string; billboardId: string };
}) => {
    // Fetch product data
    const productDoc = await getDoc(
        doc(db, 'stores', params.storeId, 'products', params.productId)
    );

    const product = productDoc.data() as Products;

    // Fetch all billboards
    const billboardsSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'billboards')
    );

    const billboards = billboardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Billboards[];

    // Fetch all categories
    const categoriesSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'categories')
    );

    const categories = categoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Categories[];

    // Fetch all kitchens
    const kitchensSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'kitchens')
    );

    const kitchens = kitchensSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Kitchens[];

    // Fetch all cuisines
    const cuisinesSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'cuisines')
    );

    const cuisines = cuisinesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Cuisines[];

    const sizesSnapshot = await getDocs(
        collection(db, 'stores', params.storeId, 'sizes')
    );
    const sizes = sizesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as Sizes[];

    // Ensure only plain objects are passed to the client component
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                {/* Pass the plain objects to productForm */}              
                <ProductForm 
                    initialData={product} 
                    billboards={billboards} 
                    categories={categories} 
                    kitchens={kitchens} 
                    cuisines={cuisines} 
                    sizes={sizes}
                />           
            </div>
        </div>
    );
};

export default ProductPage;
