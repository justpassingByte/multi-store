"use client";
import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import { KitchensColumn } from './components/column';
import SizeClient from './components/kitchen-client';

// Import Timestamp from Firebase Firestore if using Firebase
import { Timestamp } from 'firebase/firestore';

const Kitchens = ({ params }: { params: { storeId: string } }) => {
  const [kitchensData, setKitchensData] = useState<KitchensColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKitchens = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/kitchens`);
        const data: KitchensColumn[] = await response.json();

        console.log("Fetched Kitchens data:", data);

        const formattedKitchens = data.map(item => {
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

        setKitchensData(formattedKitchens);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Kitchens:', error);
        setLoading(false);
      }
    };

    fetchKitchens();
  }, [params.storeId]);

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeClient data={kitchensData} />
      </div>
    </div>
  );
};

export default Kitchens;
