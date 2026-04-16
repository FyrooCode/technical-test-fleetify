import React from 'react';
import { useInvoiceStore } from '@/store/useInvoiceStore';

export const useStep1Form = () => {
  const { sender_name, sender_address, receiver_name, receiver_address, setStep1, setStep } = useInvoiceStore();

  const formData = {
    sender_name,
    sender_address,
    receiver_name,
    receiver_address,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleInputChange = (field: string, value: string) => {
    setStep1({ [field]: value } as Record<string, string>);
  };

  return {
    formData,
    handleSubmit,
    handleInputChange,
  };
};
