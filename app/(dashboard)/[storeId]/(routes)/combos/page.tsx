"use client";
import React, { useEffect, useState } from 'react';

import ComboClient from './components/combo-client';
import Loading from '@/components/ui/loading';
import { CombosColumn } from './components/column';

const CombosPage = ({ params }: { params: { storeId: string } }) => {
  const [combosData, setCombosData] = useState<CombosColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await fetch(`/api/${params.storeId}/combos`);
        const data: CombosColumn[] = await response.json();
        console.log("Fetched Combos data:", data);
  
        setCombosData(data); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Combos:', error);
        setLoading(false);
      }
    };
  
    fetchCombos();
  }, [params.storeId]);
  

  if (loading) return <Loading />;

  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ComboClient data={combosData} />
      </div>
    </div>
  );
};

export default CombosPage;
