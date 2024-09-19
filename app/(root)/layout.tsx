// app/(root)/layout.tsx
import { db } from "@/lib/firebase";
import { auth } from "@clerk/nextjs/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { Store } from '@/type-db';
import React from 'react';

interface SetupLayoutProp {
  children: React.ReactNode;
}

const SetupLayout = async ({ children }: SetupLayoutProp) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/sign-in");
  }

  const storeSnap = await getDocs(
    query(collection(db, "stores"), where("userId", "==", userId))
  );

  let store: Store | null = null;
  storeSnap.forEach(doc => {
    store = doc.data() as Store;
  });
  console.log(store);
  
  if (store) {
    return redirect(`/${store?.id}`);
  }

  return <div>{children}</div>;
};

export default SetupLayout;
