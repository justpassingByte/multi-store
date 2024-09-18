"use client"
import React, { useEffect, useState } from 'react';

import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import { CuisinesColumn } from './components/column';
import CuisineClient from './components/cuisine-client';

const Cuisines = ({ params }: { params: { storeId: string } }) => {
  const [cuisinesData, setCuisinesData] = useState<CuisinesColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/cuisines`);
        const data: CuisinesColumn[] = await response.json();

        console.log("Fetched Cuisines data:", data);

        const formattedCuisines = data.map(item => {
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
        

        setCuisinesData(formattedCuisines);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Cuisines:', error);
        setLoading(false);
      }
    };

    fetchCuisines();
  }, [params.storeId]);

  if (loading) return <Loading/>;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CuisineClient data={cuisinesData}/>
      </div>
    </div>
  );
};

export default Cuisines;
