import api from '@/lib/axios';

export interface InvoiceDetail {
  item_id: number;
  quantity: number;
  price?: number; // Only for Admin role
}

export interface CreateInvoiceRequest {
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  details: InvoiceDetail[];
}

export interface InvoiceDetailResponse {
  id: number;
  invoice_id: number;
  item_id: number;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  total_amount: number;
  created_by: number;
  created_at: string;
  details: InvoiceDetailResponse[];
}

interface CreateInvoiceResponse {
  status: string;
  data: Invoice;
  meta: {
    timestamp: string;
  };
}

export const invoicesService = {
  /**
   * Create a new invoice
   */
  create: async (payload: CreateInvoiceRequest): Promise<Invoice> => {
    const response = await api.post<CreateInvoiceResponse>('/invoices', payload);
    return response.data.data;
  },

  /**
   * Get all invoices
   */
  getAll: async (): Promise<Invoice[]> => {
    const response = await api.get<{ status: string; data: Invoice[] }>('/invoices');
    return response.data.data;
  },
};
