import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface InvoiceDetail {
  item_id: number;
  code: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface InvoiceState {
  step: number;
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  details: InvoiceDetail[];
  invoiceCreatedAt: number | null;
  setStep: (step: number) => void;
  setStep1: (data: Partial<InvoiceState>) => void;
  setDetails: (details: InvoiceDetail[]) => void;
  setInvoiceCreatedAt: (timestamp: number | null) => void;
  resetInvoice: () => void;
}

export const useInvoiceStore = create<InvoiceState>()(
  persist(
    (set) => ({
      step: 1,
      sender_name: '',
      sender_address: '',
      receiver_name: '',
      receiver_address: '',
      details: [],
      invoiceCreatedAt: null,
      setStep: (step) => set({ step }),
      setStep1: (data) => set((state) => ({ ...state, ...data })),
      setDetails: (details) => set({ details }),
      setInvoiceCreatedAt: (timestamp) => set({ invoiceCreatedAt: timestamp }),
      resetInvoice: () => set({ 
        step: 1, 
        sender_name: '', sender_address: '', 
        receiver_name: '', receiver_address: '',
        details: [],
        invoiceCreatedAt: null,
      }),
    }),
    { name: 'invoice-storage' }
  )
);