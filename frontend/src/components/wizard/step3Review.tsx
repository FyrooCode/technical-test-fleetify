import React, { useState } from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { useRouter } from 'next/router';

export const Step3Review = () => {
  const router = useRouter();
  const { sender_name, sender_address, receiver_name, receiver_address, details, setStep, resetInvoice } = useInvoiceStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        details: details.map((item) => {
          const base: any = {
            item_id: item.item_id,
            quantity: item.quantity,
          };
          
          if (user?.role === 'Admin') {
            base.price = item.price;
          }

          return base;
        }),
      };

      await api.post('/invoices', payload);
      setStatus('success');
      
      setTimeout(() => {
        resetInvoice();
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm text-center">
        <div className="flex justify-center mb-4 text-green-500">
          <CheckCircle2 size={64} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Submit Berhasil!</h3>
        <p className="text-gray-500 mt-2">Invoice telah tersimpan di database.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-2 text-blue-600" size={24} /> Review Invoice
        </h3>
        <div className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 uppercase">
          Logged in as: {user?.role}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        <div className="space-y-3">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Pengirim</h4>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="font-bold text-gray-900">{sender_name}</p>
            <p className="text-sm text-gray-600 mt-1">{sender_address}</p>
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Penerima</h4>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="font-bold text-gray-900">{receiver_name}</p>
            <p className="text-sm text-gray-600 mt-1">{receiver_address}</p>
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-hidden border border-gray-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-4 font-bold">Item Detail</th>
              <th className="px-4 py-4 font-bold text-center w-24">Qty</th>
              <th className="px-4 py-4 font-bold text-right">Price</th>
              <th className="px-4 py-4 font-bold text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {details.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50">
                <td className="px-4 py-4">
                  <span className="font-bold text-blue-600">{item.code}</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-gray-700">{item.name}</span>
                </td>
                <td className="px-4 py-4 text-center font-medium text-gray-900">{item.quantity}</td>
                <td className="px-4 py-4 text-right text-gray-600 italic">
                  Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                </td>
                <td className="px-4 py-4 text-right font-bold text-gray-900">
                  Rp {new Intl.NumberFormat('id-ID').format(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="bg-gray-50 p-6 flex justify-end items-center border-t border-gray-200">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Keseluruhan</p>
            <p className="text-2xl font-black text-gray-900">
              Rp {new Intl.NumberFormat('id-ID').format(details.reduce((acc, curr) => acc + curr.subtotal, 0))}
            </p>
          </div>
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 font-medium">
          <AlertCircle size={20} className="mr-3 flex-shrink-0" />
          Submit gagal. Periksa koneksi ke Backend atau token Anda.
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setStep(2)}
          disabled={isSubmitting}
          className="flex items-center px-6 py-2.5 text-gray-600 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <ArrowLeft size={18} className="mr-2" /> Edit Items
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-200 disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send size={18} className="mr-2" />
          )}
          Final Submit
        </button>
      </div>
    </div>
  );
};