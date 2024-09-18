"use client";
import React, { useEffect, useState } from 'react';
import BillBoardClient from './components/client';
import { BillBoardColumn } from './components/column';
import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import { Timestamp } from 'firebase/firestore';

const BillBoards = ({ params }: { params: { storeId: string } }) => {
  const [billBoardsData, setBillBoardsData] = useState<BillBoardColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBillboards = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/billboards`);
        const data: BillBoardColumn[] = await response.json();

        console.log("Fetched data:", data); // Log raw data for debugging

        const formattedBillBoards = data.map(item => {
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
        

        setBillBoardsData(formattedBillBoards);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching billboards:', error);
        setLoading(false);
      }
    };

    fetchBillboards();
  }, [params.storeId]);

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillBoardClient data={billBoardsData} />
      </div>
    </div>
  );
};

export default BillBoards;
