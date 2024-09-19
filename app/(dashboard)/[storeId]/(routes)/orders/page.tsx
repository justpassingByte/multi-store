"use client";
import React, { useEffect, useState } from 'react';
import { format, isValid } from 'date-fns';
import Loading from '@/components/ui/loading';
import OrderClient from './components/order-client';
import { OrdersColumn } from './components/column';

// Import Timestamp from Firebase Firestore if using Firebase
import { Timestamp } from 'firebase/firestore';

const Order = ({ params }: { params: { storeId: string } }) => {
  const [orderData, setOrderData] = useState<OrdersColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/order`);
        const data: OrdersColumn[] = await response.json();

        console.log("Fetched Order data:", data);

        const formattedOrder = data.map(item => {
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

        setOrderData(formattedOrder);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Order:', error);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.storeId]);

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={orderData} />
      </div>
    </div>
  );
};

export default Order;
