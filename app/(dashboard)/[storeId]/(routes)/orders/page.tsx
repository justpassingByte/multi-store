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
        const response = await fetch(`/api/${params.storeId}/orders`);
        const data: OrdersColumn[] = await response.json();

        console.log("Fetched Order data:", data);

        // Transform the data to include aggregated image URLs
        const transformedData = data.map(order => {
          const images = order.orderItems.flatMap(item => item.images?.map(img => img.url) || []); // Extract URLs
          // Calculate total price
          const totalPrice = order.orderItems.reduce((total, item) => {
            const price = item.price || 0; // Assuming item has price
            const quantity = item.qty || 1; // Assuming item has quantity
            return total + price * quantity; // Calculate total
          }, 0).toFixed(2); // Format to 2 decimal places

          return {
            ...order,
            images,
            totalPrice,
          };
        });

        setOrderData(transformedData);
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
