import React from 'react';
import { Item } from '@/types';
import { Loader2 } from 'lucide-react';

interface MasterItemsUIProps {
  items: Item[];
  isLoading: boolean;
  error: Error | null;
}

export const MasterItemsUI: React.FC<MasterItemsUIProps> = ({ items, isLoading, error }) => {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error loading items: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto bg-white shadow-xs rounded-lg border border-gray-200">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-sm text-gray-700 bg-gray-50 border-b border-gray-200">
          <tr>
            <th scope="col" className="px-6 py-3 font-medium">
              Kode Barang
            </th>
            <th scope="col" className="px-6 py-3 font-medium">
              Nama Barang
            </th>
            <th scope="col" className="px-6 py-3 font-medium text-right">
              Harga
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              </td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                Tidak ada data barang
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id}
                className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {item.code}
                </th>
                <td className="px-6 py-4">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">
                  Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
