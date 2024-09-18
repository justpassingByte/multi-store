"use client"
import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import { ProductsColumn } from './components/column';import ProductClient from './components/product-client';
import Loading from '@/components/ui/loading';
const ProductsPage = ({ params }: { params: { storeId: string } }) => {
  const [productsData, setProductsData] = useState<ProductsColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/products`);
        const data: ProductsColumn[] = await response.json(); 
        console.log("Fetched Products data:", data);

        const formattedProducts = data.map(item => {
          let date: Date | null = null;
        
          if (item.createAt && typeof item.createAt.seconds === 'number') {
            // Convert seconds to milliseconds and create a new Date object
            date = new Date(item.createAt.seconds * 1000);
          } else if (typeof item.createAt === 'string') {
            date = new Date(item.createAt);
          }
        
          if (!date || !isValid(date)) {
            console.error("Invalid date value:", date);
            return { ...item, createAt: 'Invalid date' }; 
          }
        
          // Use a shorter date format
          const formattedDate = format(date, 'MM/dd/yyyy');
        
          return {
            ...item,
            date: formattedDate,
          };
        });

        setProductsData(formattedProducts);
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
