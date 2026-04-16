import React from 'react';
import { FileText, AlertCircle, ArrowLeft, Send, Loader2, CheckCircle2, Printer, Home } from 'lucide-react';

interface Step3ReviewUIProps {
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  details: any[];
  user: any;
  status: 'idle' | 'success' | 'error';
  isSubmitting: boolean;
  createdInvoice: any;
  onSubmit: () => void;
  onBack: () => void;
  onPrint: () => void;
  onFinish: () => void;
}

export const Step3ReviewUI: React.FC<Step3ReviewUIProps> = ({
  sender_name,
  sender_address,
  receiver_name,
  receiver_address,
  details,
  user,
  status,
  isSubmitting,
  createdInvoice,
  onSubmit,
  onBack,
  onPrint,
  onFinish,
}) => {
  // Success state - show success message
  if (status === 'success' && createdInvoice) {
    return (
      <div className="max-w-2xl mx-auto my-10">
        <div className="flex flex-col p-10 bg-white shadow-lg rounded-xl border border-gray-100 items-center text-center">
          <div className="flex justify-center mb-6 text-green-500 bg-green-50 p-4 rounded-full">
            <CheckCircle2 size={64} />
          </div>
          <h3 className="text-3xl font-bold text-gray-800 mb-2">Submit Berhasil!</h3>
          <p className="text-gray-500 mb-8">Invoice <span className="font-bold text-gray-800">{createdInvoice?.invoice_number}</span> telah aman tersimpan di database.</p>
          
          <div className="flex gap-4 w-full justify-center">
            <button onClick={onPrint} className="flex items-center justify-center px-6 py-3 w-48 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md">
              <Printer size={18} className="mr-2" /> Cetak Invoice
            </button>
            <button onClick={onFinish} className="flex items-center justify-center px-6 py-3 w-48 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md">
              <Home size={18} className="mr-2" /> Selesai
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Review form state - show review and submit form
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <FileText className="mr-2 text-blue-600" size={24} /> Review Invoice
        </h3>
        <div className="px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 uppercase">
          Role: {user?.role}
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
        <div className="bg-gray-50 p-6 flex justify-end border-t border-gray-200">
          <div className="text-right">
            <p className="text-xs font-bold text-gray-400 uppercase">Grand Total</p>
            <p className="text-2xl font-black text-gray-900">
              Rp {new Intl.NumberFormat('id-ID').format(details.reduce((a, b) => a + b.subtotal, 0))}
            </p>
          </div>
        </div>
      </div>

      {status === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 font-medium">
          <AlertCircle size={20} className="mr-3 flex-shrink-0" />
          Submit gagal. Periksa koneksi backend.
        </div>
      )}

      <div className="flex justify-between items-center">
        <button onClick={onBack} disabled={isSubmitting} className="flex items-center px-6 py-2.5 text-gray-600 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
          <ArrowLeft size={18} className="mr-2" /> Edit Items
        </button>
        <button onClick={onSubmit} disabled={isSubmitting} className="flex items-center px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg disabled:bg-gray-400">
          {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send size={18} className="mr-2" />}
          Final Submit
        </button>
      </div>
    </div>
  );
};
