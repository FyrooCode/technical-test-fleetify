import React from 'react';
import { MainLayout } from '@/components/layout/mainLayout';
import { Step1Form } from '@/components/wizard/step1Form';
import { Step2Items } from '@/components/wizard/step2Items';
import { Step3Review } from '@/components/wizard/step3Review'; // Import ini
import { useInvoiceStore } from '@/store/useInvoiceStore';

export default function WizardPage() {
  const { step } = useInvoiceStore();

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between mb-12 max-w-2xl mx-auto">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center relative z-10">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${step >= s ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-100 text-gray-400'}`}>
                  {s}
                </div>
                <span className={`absolute -bottom-7 whitespace-nowrap text-xs font-black uppercase tracking-tighter ${step >= s ? 'text-blue-600' : 'text-gray-300'}`}>
                  {s === 1 ? 'Client Data' : s === 2 ? 'Items List' : 'Final Review'}
                </span>
              </div>
              {s < 3 && <div className={`h-1 flex-1 mx-4 rounded-full transition-all duration-1000 ${step > s ? 'bg-blue-600' : 'bg-gray-100'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 1 && <Step1Form />}
          {step === 2 && <Step2Items />}
          {step === 3 && <Step3Review />}
        </div>
      </div>
    </MainLayout>
  );
}