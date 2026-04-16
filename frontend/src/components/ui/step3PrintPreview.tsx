import React from 'react';
import { Invoice, InvoiceDetailResponse } from '@/types';

interface Step3PrintPreviewProps {
  createdInvoice: Invoice;
}

export const Step3PrintPreview: React.FC<Step3PrintPreviewProps> = ({ createdInvoice }) => {
  return (
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
              Tanggal: {new Date(createdInvoice.created_at).toLocaleDateString('id-ID')} Jam: {new Date(createdInvoice.created_at).toLocaleTimeString('id-ID')}
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
            {createdInvoice.details.map((item: InvoiceDetailResponse, idx: number) => (
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
  );
};
