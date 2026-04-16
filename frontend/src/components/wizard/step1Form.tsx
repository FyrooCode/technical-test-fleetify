import React from 'react';
import { Step1FormUI } from '@/components/ui/step1FormUI';
import { useStep1Form } from '@/hooks/useStep1Form';

export const Step1Form = () => {
  const { formData, handleSubmit, handleInputChange } = useStep1Form();
  return <Step1FormUI formData={formData} onSubmit={handleSubmit} onInputChange={handleInputChange} />;
};