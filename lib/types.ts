export type Role = 'admin' | 'cashier' | 'waiter' | 'kitchen';

// User Account
export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatar?: string;
}

// Menu & Products
export interface Category {
  id: string;
  name: string;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  description?: string;
  image?: string;
  isAvailable: boolean;
  tags?: ('best-seller' | 'popular' | 'new')[];
}

// Table Management
export type TableStatus = 'available' | 'occupied' | 'reserved' | 'dirty';

export interface Table {
  id: string;
  number: string;
  seats: number;
  status: TableStatus;
  zone: 'floor1' | 'floor2';
  currentOrderId?: string; // Link to active order
}

// Order Management
export type OrderStatus = 'pending' | 'confirmed' | 'cooking' | 'ready' | 'served' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type PaymentMethod = 'cash' | 'qris' | 'card';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string; // Cached for display
  productPrice: number; // Cached price at time of order
  quantity: number;
  notes?: string;
  status: 'pending' | 'cooking' | 'ready' | 'served';
}

export interface Order {
  id: string;
  tableId: string;
  waiterId?: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  totalAmount: number;
  createdAt: string; // ISO Date
  updatedAt: string; // ISO Date
  notes?: string; // Order-level notes (e.g. "VIP Guest")
}

// Inventory & Recipes
export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number; // Reorder point
  costPerUnit: number;
}

export interface Recipe {
  id: string;
  productId: string;
  ingredients: {
    ingredientId: string;
    quantity: number;
  }[];
}
