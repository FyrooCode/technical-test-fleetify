import { useState } from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';
import { useAuthStore } from '@/store/useAuthStore';
import { invoicesService } from '@/services/invoices.service';
import { useRouter } from 'next/router';

export const useStep3Review = () => {
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

      const createdInvoiceData = await invoicesService.create(payload);
      setCreatedInvoice(createdInvoiceData);
      setStatus('success');
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
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
