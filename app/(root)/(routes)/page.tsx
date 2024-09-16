// app/(root)/(routes)/page.tsx
"use client"
import React, { useEffect } from 'react';
import { useStoreModal } from '@/app/hooks/use-store-modal';

const SetupPage: React.FC = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
    <div>
      Store modal
    </div>
  );
};

export default SetupPage;
