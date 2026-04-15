import React from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';

export const Step1Form = () => {
  const { sender_name, sender_address, receiver_name, receiver_address, setStep1, setStep } = useInvoiceStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const inputClass = "bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5 shadow-sm outline-none transition-all";
  const labelClass = "block mb-2 text-sm font-semibold text-gray-700";

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Step 1: Data Klien</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Informasi Pengirim</h4>
            <div>
              <label className={labelClass}>Nama Pengirim</label>
              <input
                type="text"
                value={sender_name}
                onChange={(e) => setStep1({ sender_name: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Alamat Pengirim</label>
              <textarea
                value={sender_address}
                onChange={(e) => setStep1({ sender_address: e.target.value })}
                className={`${inputClass} min-h-[100px]`}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-green-600 uppercase tracking-widest">Informasi Penerima</h4>
            <div>
              <label className={labelClass}>Nama Penerima</label>
              <input
                type="text"
                value={receiver_name}
                onChange={(e) => setStep1({ receiver_name: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Alamat Penerima</label>
              <textarea
                value={receiver_address}
                onChange={(e) => setStep1({ receiver_address: e.target.value })}
                className={`${inputClass} min-h-[100px]`}
                required
              />
            </div>
          </div>
        </div>
        <div className="pt-6 border-t flex justify-end">
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-8 rounded-lg transition-colors shadow-lg"
          >
            Next Step
          </button>
        </div>
      </form>
    </div>
  );
};