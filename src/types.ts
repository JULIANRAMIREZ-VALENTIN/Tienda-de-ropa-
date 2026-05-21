export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: "Pendiente" | "En preparación" | "Enviado" | "Entregado";
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  shift: "Matutino" | "Vespertino" | "Nocturno";
  avatar: string;
}

export interface SaleRecord {
  id: string;
  orderId: string;
  customerName: string;
  date: string;
  totalAmount: number;
  itemsCount: number;
}
