"use client";
import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import { SizesColumn } from './components/column';
import SizeClient from './components/size-client';

// Import Timestamp from Firebase Firestore if using Firebase
import { Timestamp } from 'firebase/firestore';

const Sizes = ({ params }: { params: { storeId: string } }) => {
  const [sizesData, setSizesData] = useState<SizesColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/sizes`);
        const data: SizesColumn[] = await response.json();

        console.log("Fetched sizes data:", data);

        const formattedSizes = data.map(item => {
          let date: Date | null = null;

          // Type guard for Timestamp
          if (item.createAt && typeof item.createAt === 'object' && 'seconds' in item.createAt) {
            date = new Date((item.createAt as Timestamp).seconds * 1000);
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

        setSizesData(formattedSizes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Sizes:', error);
        setLoading(false);
      }
    };

    fetchSizes();
  }, [params.storeId]);

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={sizesData} />
      </div>
    </div>
  );
};

export default Sizes;
