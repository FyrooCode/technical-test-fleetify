import React from 'react';
import { Trash2, Plus, Loader2, ArrowLeft } from 'lucide-react';

interface Step2ItemsUIProps {
  details: any[];
  searchResults: { [key: number]: any[] };
  loadingMap: { [key: number]: boolean };
  activeDropdown: number | null;
  containerRef: React.RefObject<HTMLDivElement>;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onInputChange: (index: number, value: string) => void;
  onQuantityChange: (index: number, quantity: number) => void;
  onSelectItem: (index: number, item: any) => void;
  onSetActiveDropdown: (index: number | null) => void;
  onFetchItems: (index: number, query: string) => void;
  onSetStep: (step: number) => void;
}

export const Step2ItemsUI: React.FC<Step2ItemsUIProps> = ({
  details,
  searchResults,
  loadingMap,
  activeDropdown,
  containerRef,
  onAddRow,
  onRemoveRow,
  onInputChange,
  onQuantityChange,
  onSelectItem,
  onSetActiveDropdown,
  onFetchItems,
  onSetStep,
}) => {
  const inputClass = "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 transition-all outline-none";

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm" ref={containerRef}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-800">Step 2: Data Barang</h3>
        <button 
          onClick={onAddRow} 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors"
        >
          <Plus size={18} className="mr-2" /> Add Item
        </button>
      </div>

      <div className="overflow-visible mb-8">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Kode Barang</th>
              <th className="px-4 py-3">Nama Barang</th>
              <th className="px-4 py-3 w-24 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Subtotal</th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {details.map((row, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50">
                <td className="px-4 py-4 align-top">
                  <div className="relative">
                    <input
                      type="text"
                      value={row.code}
                      onFocus={() => {
                        onSetActiveDropdown(index);
                        onFetchItems(index, row.code || '');
                      }}
                      onChange={(e) => onInputChange(index, e.target.value)}
                      className={inputClass}
                      placeholder="Input code..."
                    />
                    {loadingMap[index] && <Loader2 className="absolute right-2 top-2.5 animate-spin text-blue-500" size={16} />}
                    
                    {activeDropdown === index && searchResults[index]?.length > 0 && (
                      <div className="absolute z-[999] w-full bg-white border border-gray-200 rounded-md mt-1 shadow-xl max-h-48 overflow-y-auto">
                        {searchResults[index].map((item) => (
                          <div 
                            key={item.id}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              onSelectItem(index, item);
                            }}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-none"
                          >
                            <div className="font-bold text-blue-600 text-xs">{item.code}</div>
                            <div className="text-[11px] text-gray-500 truncate">{item.name}</div>
                            <div className="text-[10px] font-bold text-gray-700 mt-0.5">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <input 
                    type="text" 
                    value={row.name} 
                    className={`${inputClass} bg-gray-50 cursor-not-allowed text-gray-500`} 
                    readOnly 
                  />
                </td>
                <td className="px-4 py-4 align-top">
                  <input
                    type="number"
                    min="1"
                    value={row.quantity}
                    onChange={(e) => onQuantityChange(index, parseInt(e.target.value) || 0)}
                    className={`${inputClass} text-center`}
                  />
                </td>
                <td className="px-4 py-4 align-top text-right font-bold text-gray-900 py-6">
                  Rp {new Intl.NumberFormat('id-ID').format(row.subtotal)}
                </td>
                <td className="px-4 py-4 align-top text-right">
                  <button onClick={() => onRemoveRow(index)} className="text-gray-400 hover:text-red-600 transition-colors p-2">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pt-6 border-t flex justify-between items-center">
        <button 
          onClick={() => onSetStep(1)} 
          className="flex items-center px-6 py-2 text-gray-600 font-bold border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" /> Back
        </button>
        <div className="text-right mr-4">
           <span className="text-gray-500 text-sm mr-2">Total Amount:</span>
           <span className="text-xl font-bold text-gray-900">
             Rp {new Intl.NumberFormat('id-ID').format(details.reduce((acc, curr) => acc + curr.subtotal, 0))}
           </span>
        </div>
        <button 
          onClick={() => onSetStep(3)} 
          disabled={details.length === 0 || details.some(d => d.item_id === 0)}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 px-10 rounded-md transition-all shadow-sm"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};
