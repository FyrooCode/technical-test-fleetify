import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { invoicesService } from '@/services/invoices.service';
import { useRouter } from 'next/router';
import type { Invoice } from '@/types';

const INVOICE_STALE_TIME = 30000; // 30 seconds - if invoice is older than this, reset on page load

export const useStep3Review = () => {
  const router = useRouter();
  const { sender_name, sender_address, receiver_name, receiver_address, details, setStep, resetInvoice, invoiceCreatedAt, setInvoiceCreatedAt } = useInvoiceStore();
  const { user } = useAuthStore();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [createdInvoice, setCreatedInvoice] = useState<Invoice | null>(null);

  // Auto-reset wizard if invoice is stale (from previous session)
  useEffect(() => {
    if (invoiceCreatedAt) {
      const timeSinceCreation = Date.now() - invoiceCreatedAt;
      
      if (timeSinceCreation > INVOICE_STALE_TIME) {
        // Invoice is stale, reset to step 1
        resetInvoice();
        setStatus('idle');
        setCreatedInvoice(null);
        setStep(1);
      } else {
        // Invoice is fresh, show success page
        setStatus('success');
        // Load the persisted createdInvoice from localStorage if available
        const stored = localStorage.getItem('last-created-invoice');
        if (stored) {
          try {
            setCreatedInvoice(JSON.parse(stored) as Invoice);
          } catch (parseError) {
            console.error('Failed to parse stored invoice', parseError);
          }
        }
      }
    }
  }, [invoiceCreatedAt, resetInvoice, setStep]);

  type CreateInvoiceDetail = {
    item_id: number;
    quantity: number;
    price?: number;
  };

  type CreateInvoicePayload = {
    sender_name: string;
    sender_address: string;
    receiver_name: string;
    receiver_address: string;
    details: CreateInvoiceDetail[];
  };

  const { mutate: submitInvoice, isPending: isSubmitting } = useMutation({
    mutationFn: async (): Promise<Invoice> => {
      const payload = {
        sender_name,
        sender_address,
        receiver_name,
        receiver_address,
        details: details.map((item) => {
          const base: CreateInvoiceDetail = { item_id: item.item_id, quantity: item.quantity };
          if (user?.role === 'Admin') base.price = item.price;
          return base;
        }),
      } as CreateInvoicePayload;

      return invoicesService.create(payload) as Promise<Invoice>;
    },
    onSuccess: (data: Invoice) => {
      setCreatedInvoice(data);
      setStatus('success');
      setInvoiceCreatedAt(Date.now());
      // Store invoice in localStorage for recovery on refresh
      localStorage.setItem('last-created-invoice', JSON.stringify(data));
      toast.success(`Invoice ${data.invoice_number} created successfully!`);
    },
    onError: (error: Error) => {
      console.error('Invoice creation failed:', error);
      setStatus('error');
      const err = error as unknown as { response?: { data?: { error?: { message?: string } } } };
      const errorMsg = err?.response?.data?.error?.message || 'Failed to create invoice. Please try again.';
      toast.error(errorMsg);
    },
  });

  const handlePrint = () => {
    // Set document title to invoice number for PDF filename
    const originalTitle = document.title;
    if (createdInvoice?.invoice_number) {
      document.title = `${createdInvoice.invoice_number}`;
    }
    
    // Delay print to ensure title is updated
    setTimeout(() => {
      window.print();
      // Restore original title after print
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }, 100);
  };

  const handleFinish = () => {
    // Clear stored invoice when finishing
    localStorage.removeItem('last-created-invoice');
    resetInvoice();
    router.push('/');
  };

  const handleSubmit = () => {
    submitInvoice();
  };

  return {
    sender_name,
    sender_address,
    receiver_name,
    receiver_address,
    details,
    user,
    isSubmitting,
    status,
    createdInvoice,
    handlePrint,
    handleFinish,
    handleSubmit,
    setStep,
  };
};
