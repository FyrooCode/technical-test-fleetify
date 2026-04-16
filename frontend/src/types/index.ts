export interface User {
  id: number;
  username: string;
  role: 'Admin' | 'Kerani';
}

export interface Item {
  id: number;
  code: string;
  name: string;
  price: number;
}

export interface InvoiceDetail {
  item_id: number;
  quantity: number;
}

export interface InvoiceRequest {
  sender_name: string;
  sender_address: string;
  receiver_name: string;
  receiver_address: string;
  details: InvoiceDetail[];
}

export interface InvoiceDetailDisplay {
  item_id: number;
  code: string;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface InvoiceDetailResponse {
  id: number;
  invoice_id: number;
  item_id: number;
  quantity: number;
  price: number;
  subtotal: number;
  item?: Item;
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