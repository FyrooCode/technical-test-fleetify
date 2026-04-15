import React, { useState, ReactNode } from 'react';
import { Sidebar } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="sm:ml-64 w-full">
        <div className="p-4 mt-12 sm:mt-0">
          {children}
        </div>
      </div>
    </div>
  );
};
