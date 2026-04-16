import React from 'react';
import { Step3ReviewUI } from '@/components/ui/step3ReviewUI';
import { Step3PrintPreview } from '@/components/ui/step3PrintPreview';
import { useStep3Review } from '@/hooks/useStep3Review';

export const Step3Review = () => {
  const {
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
  } = useStep3Review();

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
        <Step3PrintPreview createdInvoice={createdInvoice} />
      )}

      <div className="screen-only">
        <Step3ReviewUI
          sender_name={sender_name}
          sender_address={sender_address}
          receiver_name={receiver_name}
          receiver_address={receiver_address}
          details={details}
          user={user}
          isSubmitting={isSubmitting}
          status={status}
          createdInvoice={createdInvoice}
          onPrint={handlePrint}
          onFinish={handleFinish}
          onSubmit={handleSubmit}
          onBack={() => setStep(2)}
        />
      </div>
    </>
  );
};