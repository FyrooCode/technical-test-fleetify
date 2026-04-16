import React from 'react';
import { Invoice } from '@/types';
import { Loader2, Printer } from 'lucide-react';

interface InvoiceHistoryUIProps {
  invoices: Invoice[];
  isLoading: boolean;
  error: Error | null;
  onPrint?: (invoice: Invoice) => void;
}

export const InvoiceHistoryUI: React.FC<InvoiceHistoryUIProps> = ({
  invoices,
  isLoading,
  error,
  onPrint,
}) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error loading invoices: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs font-semibold text-gray-700 bg-gray-100 border-b border-gray-300 uppercase tracking-wide">
          <tr>
            <th scope="col" className="px-6 py-4">No. Invoice</th>
            <th scope="col" className="px-6 py-4">Tanggal</th>
            <th scope="col" className="px-6 py-4">Pengirim</th>
            <th scope="col" className="px-6 py-4">Penerima</th>
            <th scope="col" className="px-6 py-4 text-right">Total</th>
            <th scope="col" className="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              </td>
            </tr>
          ) : invoices.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                Tidak ada invoice
              </td>
            </tr>
          ) : (
            invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="bg-white hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-semibold text-gray-900">
                  {invoice.invoice_number}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(invoice.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{invoice.sender_name}</div>
                  <div className="text-xs text-gray-500 truncate">{invoice.sender_address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{invoice.receiver_name}</div>
                  <div className="text-xs text-gray-500 truncate">{invoice.receiver_address}</div>
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  Rp {new Intl.NumberFormat('id-ID').format(invoice.total_amount)}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onPrint?.(invoice)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <Printer size={16} />
                    Cetak
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
