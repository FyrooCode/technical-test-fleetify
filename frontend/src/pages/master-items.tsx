import React from 'react';
import { MainLayout } from '@/components/layout/mainLayout';
import { useMasterItems } from '@/hooks/useMasterItems';
import { MasterItemsUI } from '@/components/ui/masterItemsUI';

export default function MasterItemsPage() {
  const { items, isLoading, error } = useMasterItems();

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Master Items</h1>
        <MasterItemsUI items={items} isLoading={isLoading} error={error} />
      </div>
    </MainLayout>
  );
}
