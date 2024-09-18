import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from '@/type-db';
import React from 'react';
import Navbar from "@/components/ui/navbar";
interface DashBoardLayoutProps {
  children: React.ReactNode;
  params: { storeId: string };
}

const DashBoardLayout = async ({ children, params }: DashBoardLayoutProps) => {
  const userAuth = auth();
  console.log("User Auth:", userAuth); 
  const { userId } = userAuth;
  
  if (!userId) {
    return redirect("/sign-in");
  }

  console.log("Fetching store :", params.storeId);
  const storeSnap = await getDocs(
    query(
      collection(db, "stores"),
      where("userId", "==", userId),
      where("id", "==", params.storeId)
    )
  );

  let store = null;
  storeSnap.forEach(doc => {
    store = doc.data() as Store;
  });

  if (!store) {
    console.log("No store found for this user and storeId");
    return redirect("/"); 
  }
  console.log("Store:" + store);
  
  return (
    <>
      <Navbar/>
      {children}
    </>
  );
};

export default DashBoardLayout;
