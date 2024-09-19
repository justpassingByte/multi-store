"use client";
import React, { useEffect, useState } from 'react';
import { ProductsColumn } from './components/column';
import ProductClient from './components/product-client';
import Loading from '@/components/ui/loading';
// Import Timestamp from Firebase Firestore if using Firebase

const ProductsPage = ({ params }: { params: { storeId: string } }) => {
  const [productsData, setProductsData] = useState<ProductsColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/products`);
        const data: ProductsColumn[] = await response.json();
        console.log("Fetched Products data:", data);
  
        setProductsData(data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Products:', error);
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, [params.storeId]);
  

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={productsData} />
      </div>
    </div>
  );
};

export default ProductsPage;
