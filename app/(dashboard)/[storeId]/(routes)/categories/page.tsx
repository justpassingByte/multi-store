"use client"
import React, { useEffect, useState } from 'react';

import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import CategoryClient from './components/category-client';
import { CategoriesColumn } from './components/column';

const Categories = ({ params }: { params: { storeId: string } }) => {
  const [categoriesData, setCategoriesData] = useState<CategoriesColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/categories`);
        const data: CategoriesColumn[] = await response.json();

        console.log("Fetched category data:", data);
        const formattedCategories = data.map(item => {
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
            createAt: formattedDate,
          };
        });
        

        setCategoriesData(formattedCategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [params.storeId]);

  if (loading) return <Loading/>;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={categoriesData}/>
      </div>
    </div>
  );
};

export default Categories;
