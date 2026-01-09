
export interface Product {
  id: string;
  code: string;
  name: string;
  price: number;
  sizes: string[];
  colors: string[];
  isAvailable: boolean;
}

export interface ShippingRate {
  governorate: string;
  cost: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  governorate: string;
  items: Array<{
    productCode: string;
    productName: string;
    size: string;
    color: string;
    price: number;
  }>;
  shippingCost: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'delivered' | 'suspended';
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  INVENTORY = 'INVENTORY',
  SHIPPING = 'SHIPPING',
  AI_CHAT = 'AI_CHAT',
  ORDERS = 'ORDERS',
  SALES = 'SALES',
  SETTINGS = 'SETTINGS'
}
