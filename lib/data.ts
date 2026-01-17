import { Category, Product, Table, Order, Ingredient, User } from './types';

// Users
export const USERS: User[] = [
  { id: 'u1', name: 'Manager Somchai', email: 'somchai@thaicafe.com', role: 'admin', avatar: '/avatars/manager.png' },
  { id: 'u2', name: 'Waiter Nop', email: 'nop@thaicafe.com', role: 'waiter', avatar: '/avatars/waiter.png' },
  { id: 'u3', name: 'Chef Lek', email: 'lek@thaicafe.com', role: 'kitchen', avatar: '/avatars/chef.png' },
  { id: 'u4', name: 'Cashier Mai', email: 'mai@thaicafe.com', role: 'cashier', avatar: '/avatars/cashier.png' },
];

// Categories
export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Hidangan Pembuka', isAvailable: true },
  { id: 'c2', name: 'Hidangan Utama', isAvailable: true },
  { id: 'c3', name: 'Sup', isAvailable: true },
  { id: 'c4', name: 'Minuman', isAvailable: true },
];

// Products
export const PRODUCTS: Product[] = [
  { 
    id: 'p1', name: 'Spring Rolls', categoryId: 'c1', price: 45000, isAvailable: true, 
    image: 'https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=300&q=80' 
  },
  { 
    id: 'p2', name: 'Pad Thai', categoryId: 'c2', price: 65000, isAvailable: true, tags: ['best-seller'],
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 'p3', name: 'Tom Yum Goong', categoryId: 'c3', price: 75000, isAvailable: true, tags: ['popular'],
    image: 'https://images.unsplash.com/photo-1548943487-a79fe6509462?auto=format&fit=crop&w=300&q=80'
  },
  { 
    id: 'p4', name: 'Thai Iced Tea', categoryId: 'c4', price: 25000, isAvailable: true,
    image: 'https://images.unsplash.com/photo-1626804475297-411d8c66c8e3?auto=format&fit=crop&w=300&q=80'
  }
];

// Tables
export const TABLES: Table[] = [
  { id: 't1', number: 'T1', seats: 2, status: 'occupied', zone: 'floor1', currentOrderId: 'o1' }, // Main Hall
  { id: 't2', number: 'T2', seats: 4, status: 'available', zone: 'floor1' }, // Main Hall
  { id: 't3', number: 'A1', seats: 6, status: 'reserved', zone: 'floor2' }, // AC Room
  { id: 't4', number: 'A2', seats: 2, status: 'dirty', zone: 'floor2' }, // AC Room
];

// Orders (Centralized State)
export const ORDERS: Order[] = [
  {
    id: 'o1',
    tableId: 't1',
    waiterId: 'u2',
    status: 'cooking', // Visible in Kitchen
    paymentStatus: 'pending', // Visible in Cashier
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    items: [
      { id: 'i1', productId: 'p2', productName: 'Pad Thai', productPrice: 65000, quantity: 2, status: 'cooking' },
      { id: 'i2', productId: 'p4', productName: 'Thai Iced Tea', productPrice: 25000, quantity: 2, status: 'ready' }
    ],
    subtotal: 180000,
    tax: 18000,
    serviceCharge: 9000,
    totalAmount: 207000,
    notes: "Tanpa kacang untuk Pad Thai"
  },
  {
    id: 'o2', // Completed order
    tableId: 't2', 
    waiterId: 'u2',
    status: 'completed',
    paymentStatus: 'paid',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date().toISOString(),
    items: [
       { id: 'i3', productId: 'p1', productName: 'Spring Rolls', productPrice: 45000, quantity: 1, status: 'served' }
    ],
    subtotal: 45000,
    tax: 4500,
    serviceCharge: 2250,
    totalAmount: 51750,
    paymentMethod: 'cash'
  }
];

// Inventory
export const INVENTORY: Ingredient[] = [
  { id: 'ing1', name: 'Bihun', unit: 'kg', stock: 15.5, minStock: 5, costPerUnit: 20000 },
  { id: 'ing2', name: 'Udang', unit: 'kg', stock: 3.2, minStock: 5, costPerUnit: 150000 },
];
