import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { invoicesService } from '@/services/invoices.service';
import toast from 'react-hot-toast';
import { Invoice } from '@/types';

export const useInvoiceHistory = () => {
  const [invoiceToPrint, setInvoiceToPrint] = useState<Invoice | null>(null);

  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['invoices-history'],
    queryFn: async () => {
      try {
        return await invoicesService.getAll();
      } catch (err) {
        const error = err as Error;
        toast.error('Failed to load invoice history. Please try again.');
        throw error;
      }
    },
  });

  const handlePrint = (invoice: Invoice) => {
    const originalTitle = document.title;
    if (invoice?.invoice_number) {
      document.title = `${invoice.invoice_number}`;
    }
    setInvoiceToPrint(invoice);
    
    Promise.resolve().then(() => {
      window.print();
    });
    
    const printHandler = () => {
      document.title = originalTitle;
      setInvoiceToPrint(null);
      window.removeEventListener('afterprint', printHandler);
    };
    window.addEventListener('afterprint', printHandler);
  };

  return {
    invoices,
    isLoading,
    error: error as Error | null,
    handlePrint,
    invoiceToPrint,
  };
};
