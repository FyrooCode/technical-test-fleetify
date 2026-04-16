import React, { useState } from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';
import { ArrowLeft, Send, CheckCircle2, AlertCircle, FileText, Printer, Home, Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

export const Step3Review = () => {
  const router = useRouter();
  const { sender_name, sender_address, receiver_name, receiver_address, details, setStep, resetInvoice } = useInvoiceStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [createdInvoice, setCreatedInvoice] = useState<any>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    resetInvoice();
    router.push('/');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        details: details.map((item) => {
          const base: any = { item_id: item.item_id, quantity: item.quantity };
          if (user?.role === 'Admin') base.price = item.price;
          return base;
        }),
      };

      const response = await api.post('/invoices', payload);
      setCreatedInvoice(response.data.data);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          @page { size: A4 portrait; margin: 15mm; }
          .screen-only { display: none !important; }
          body { 
            background: white !important; 
            margin: 0; 
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-only { 
            display: block !important; 
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
        }
      `}</style>

      {status === 'success' && createdInvoice && (
        <div className="print-only">
          <div style={{ fontFamily: 'Arial, sans-serif', color: '#000', lineHeight: '1.5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#2563eb' }}>FLEETIFY LOGISTICS</h1>
                <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>Sistem Manajemen Pengiriman Terpadu</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#1f2937' }}>INVOICE</h2>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#4b5563' }}>{createdInvoice.invoice_number}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Tanggal: {new Date(createdInvoice.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
              <div style={{ width: '45%' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 8px 0' }}>Bill To (Penerima):</h3>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '16px' }}>{createdInvoice.receiver_name}</p>
                <p style={{ margin: 0, fontSize: '14px' }}>{createdInvoice.receiver_address}</p>
              </div>
              <div style={{ width: '45%' }}>
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: '#6b7280', margin: '0 0 8px 0' }}>From (Pengirim):</h3>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '16px' }}>{createdInvoice.sender_name}</p>
                <p style={{ margin: 0, fontSize: '14px' }}>{createdInvoice.sender_address}</p>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d1d5db' }}>
                  <th style={{ textAlign: 'left', padding: '12px 0', fontSize: '14px', color: '#4b5563' }}>ITEM</th>
                  <th style={{ textAlign: 'center', padding: '12px 0', fontSize: '14px', color: '#4b5563' }}>QTY</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', color: '#4b5563' }}>RATE</th>
                  <th style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', color: '#4b5563' }}>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {createdInvoice.details.map((item: any, idx: number) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 0', fontSize: '14px' }}>{item.item?.name || 'Item'}</td>
                    <td style={{ textAlign: 'center', padding: '12px 0', fontSize: '14px' }}>{item.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px' }}>Rp {new Intl.NumberFormat('id-ID').format(item.price)}</td>
                    <td style={{ textAlign: 'right', padding: '12px 0', fontSize: '14px', fontWeight: 'bold' }}>Rp {new Intl.NumberFormat('id-ID').format(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '48px' }}>
              <div style={{ width: '300px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: '14px' }}>
                  <span style={{ color: '#4b5563' }}>Subtotal:</span>
                  <span>Rp {new Intl.NumberFormat('id-ID').format(createdInvoice.total_amount)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '18px', fontWeight: 'bold', borderTop: '2px solid #000' }}>
                  <span>Total:</span>
                  <span>Rp {new Intl.NumberFormat('id-ID').format(createdInvoice.total_amount)}</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '64px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 4px 0' }}>Terima Kasih!</h4>
              <p style={{ margin: 0, fontSize: '14px', color: '#4b5563' }}>Telah menggunakan layanan Fleetify Logistics.</p>
            </div>
            
            <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', width: '300px' }}>
              <div style={{ textAlign: 'center', width: '120px' }}>
                <div style={{ borderBottom: '1px solid #000', height: '60px', marginBottom: '8px' }}></div>
                <p style={{ fontSize: '12px' }}>Pengirim</p>
              </div>
              <div style={{ textAlign: 'center', width: '120px' }}>
                <div style={{ borderBottom: '1px solid #000', height: '60px', marginBottom: '8px' }}></div>
                <p style={{ fontSize: '12px' }}>Penerima</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="screen-only">
        {status === 'success' ? (
          <div className="max-w-2xl mx-auto my-10">
            <div className="flex flex-col p-10 bg-white shadow-lg rounded-xl border border-gray-100 items-center text-center">
              <div className="flex justify-center mb-6 text-green-500 bg-green-50 p-4 rounded-full">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Submit Berhasil!</h3>
              <p className="text-gray-500 mb-8">Invoice <span className="font-bold text-gray-800">{createdInvoice?.invoice_number}</span> telah aman tersimpan di database.</p>
              
              <div className="flex gap-4 w-full justify-center">
                <button onClick={handlePrint} className="flex items-center justify-center px-6 py-3 w-48 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-all shadow-md">
                  <Printer size={18} className="mr-2" /> Cetak Invoice
                </button>
                <button onClick={handleFinish} className="flex items-center justify-center px-6 py-3 w-48 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md">
                  <Home size={18} className="mr-2" /> Selesai
                </button>
              </div>
            </div>
          </div>
        ) : (
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
              <button onClick={() => setStep(2)} disabled={isSubmitting} className="flex items-center px-6 py-2.5 text-gray-600 font-bold border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                <ArrowLeft size={18} className="mr-2" /> Edit Items
              </button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center px-12 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all shadow-lg disabled:bg-gray-400">
                {isSubmitting ? <Loader2 className="animate-spin mr-2" size={18} /> : <Send size={18} className="mr-2" />}
                Final Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};