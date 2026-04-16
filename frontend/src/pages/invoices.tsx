import React from 'react';
import { MainLayout } from '@/components/layout/mainLayout';
import { useInvoiceHistory } from '@/hooks/useInvoiceHistory';
import { InvoiceHistoryUI } from '@/components/ui/invoiceHistoryUI';
import { InvoicePrintPreview } from '@/components/ui/invoicePrintPreview';

export default function InvoicesPage() {
  const { invoices, isLoading, error, handlePrint, invoiceToPrint } = useInvoiceHistory();

  return (
    <MainLayout>
      <div className="p-6 print:hidden">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Invoice History</h1>
        <InvoiceHistoryUI 
          invoices={invoices} 
          isLoading={isLoading} 
          error={error}
          onPrint={handlePrint}
        />
      </div>
      
      {invoiceToPrint && (
        <div className="hidden print:block">
          <InvoicePrintPreview invoice={invoiceToPrint} />
        </div>
      )}
    </MainLayout>
  );
}
