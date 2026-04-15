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