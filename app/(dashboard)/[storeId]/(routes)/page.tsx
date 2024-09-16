// app/(dashboard)/[storeId]/(routes)/page.tsx
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Store } from '@/type-db';
import React from 'react';

interface DashBoardOverviewProp {
  params: { storeId: string };
}

const DashBoardOverview = async ({ params }: DashBoardOverviewProp) => {
  const storeDoc = await getDoc(doc(db, "stores", params.storeId));
  const store = storeDoc.exists() ? (storeDoc.data() as Store) : null;

  // Log dữ liệu để kiểm tra
  console.log("Store data:", store);

  if (!store) {
    return <div>Store not found.</div>;
  }

  return (
    <div>
      <h1>Overview: {store.name}</h1>
    </div>
  );
};

export default DashBoardOverview;
