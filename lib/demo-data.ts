import type {
  OrderSource,
  OrderStatus,
  PaymentMethod,
  QueueStatus,
  TableStatus,
  UserRole,
} from "@prisma/client";

const now = new Date("2026-06-12T03:30:00.000Z");
const hourAgo = new Date("2026-06-12T02:30:00.000Z");
const twoHoursAgo = new Date("2026-06-12T01:30:00.000Z");

export type DemoUser = {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string | null;
  email: string | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const demoUsers: DemoUser[] = [
  {
    id: "demo-user-admin",
    username: "admin",
    password: "admin123",
    role: "ADMIN",
    name: "Manajer Somchai",
    email: "admin@thaicafe.test",
    avatar: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-user-kasir",
    username: "kasir",
    password: "kasir123",
    role: "KASIR",
    name: "Kasir Mai",
    email: "kasir@thaicafe.test",
    avatar: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-user-waiter",
    username: "waiter",
    password: "waiter123",
    role: "WAITER",
    name: "Pelayan Nop",
    email: "waiter@thaicafe.test",
    avatar: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-user-kitchen",
    username: "kitchen",
    password: "kitchen123",
    role: "KITCHEN",
    name: "Chef Lek",
    email: "kitchen@thaicafe.test",
    avatar: null,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoCategories = [
  {
    id: "demo-category-starter",
    name: "Hidangan Pembuka",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-category-main",
    name: "Hidangan Utama",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-category-soup",
    name: "Sup",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-category-drink",
    name: "Minuman",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoMenus = [
  {
    id: "demo-menu-spring-rolls",
    name: "Spring Rolls",
    price: 45000,
    categoryId: "demo-category-starter",
    description: "Lumpia renyah dengan saus asam manis Thai Cafe.",
    image: "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-menu-pad-thai",
    name: "Pad Thai",
    price: 65000,
    categoryId: "demo-category-main",
    description: "Kwetiau tumis khas Thailand dengan kacang, telur, dan lime.",
    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-menu-tom-yum",
    name: "Tom Yum Goong",
    price: 75000,
    categoryId: "demo-category-soup",
    description: "Sup udang pedas asam dengan aroma serai dan daun jeruk.",
    image: "https://images.unsplash.com/photo-1548943487-a79fe6509462?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-menu-thai-tea",
    name: "Thai Iced Tea",
    price: 25000,
    categoryId: "demo-category-drink",
    description: "Teh susu Thailand dingin, creamy, dan harum.",
    image: "https://images.unsplash.com/photo-1626804475297-411d8c66c8e3?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-menu-green-curry",
    name: "Green Curry",
    price: 70000,
    categoryId: "demo-category-main",
    description: "Kari hijau creamy dengan basil, sayur, dan nasi hangat.",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=600&q=80",
    isAvailable: true,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoTables = [
  {
    id: "demo-table-1",
    tableNo: 1,
    capacity: 2,
    status: "OCCUPIED" as TableStatus,
    zone: "floor1",
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-table-2",
    tableNo: 2,
    capacity: 4,
    status: "AVAILABLE" as TableStatus,
    zone: "floor1",
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-table-3",
    tableNo: 3,
    capacity: 6,
    status: "OCCUPIED" as TableStatus,
    zone: "floor1",
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-table-4",
    tableNo: 4,
    capacity: 2,
    status: "CLEANING" as TableStatus,
    zone: "floor2",
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-table-5",
    tableNo: 5,
    capacity: 4,
    status: "AVAILABLE" as TableStatus,
    zone: "floor2",
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoMembers = [
  {
    id: "demo-member-1",
    name: "Ari Wibowo",
    phone: "081234567890",
    points: 120,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-member-2",
    name: "Nadya Putri",
    phone: "081298765432",
    points: 80,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoIngredients = [
  {
    id: "demo-ingredient-rice-noodle",
    name: "Bihun",
    unit: "kg",
    currentStock: 15.5,
    minStock: 5,
    costPerUnit: 20000,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-ingredient-shrimp",
    name: "Udang",
    unit: "kg",
    currentStock: 3.2,
    minStock: 5,
    costPerUnit: 150000,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-ingredient-tea",
    name: "Teh Thai",
    unit: "kg",
    currentStock: 2,
    minStock: 1,
    costPerUnit: 80000,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
  {
    id: "demo-ingredient-milk",
    name: "Susu Kental Manis",
    unit: "kaleng",
    currentStock: 10,
    minStock: 5,
    costPerUnit: 15000,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

export const demoRecipes = [
  {
    id: "demo-recipe-pad-thai-noodle",
    menuId: "demo-menu-pad-thai",
    ingredientId: "demo-ingredient-rice-noodle",
    qtyNeeded: 0.18,
    unit: "kg",
  },
  {
    id: "demo-recipe-tom-yum-shrimp",
    menuId: "demo-menu-tom-yum",
    ingredientId: "demo-ingredient-shrimp",
    qtyNeeded: 0.25,
    unit: "kg",
  },
  {
    id: "demo-recipe-thai-tea",
    menuId: "demo-menu-thai-tea",
    ingredientId: "demo-ingredient-tea",
    qtyNeeded: 0.03,
    unit: "kg",
  },
  {
    id: "demo-recipe-thai-tea-milk",
    menuId: "demo-menu-thai-tea",
    ingredientId: "demo-ingredient-milk",
    qtyNeeded: 0.2,
    unit: "kaleng",
  },
];

const menuById = new Map(demoMenus.map((menu) => [menu.id, menu]));
const categoryById = new Map(demoCategories.map((category) => [category.id, category]));
const tableById = new Map(demoTables.map((table) => [table.id, table]));
const userById = new Map(demoUsers.map((user) => [user.id, user]));
const memberById = new Map(demoMembers.map((member) => [member.id, member]));

export const demoOrderDetails = [
  {
    id: "demo-order-detail-1",
    orderId: "demo-order-1",
    menuId: "demo-menu-pad-thai",
    qty: 2,
    subtotal: 130000,
    notes: "Tidak terlalu pedas",
  },
  {
    id: "demo-order-detail-2",
    orderId: "demo-order-1",
    menuId: "demo-menu-thai-tea",
    qty: 2,
    subtotal: 50000,
    notes: null,
  },
  {
    id: "demo-order-detail-3",
    orderId: "demo-order-2",
    menuId: "demo-menu-tom-yum",
    qty: 1,
    subtotal: 75000,
    notes: "Tambah lime",
  },
  {
    id: "demo-order-detail-4",
    orderId: "demo-order-3",
    menuId: "demo-menu-green-curry",
    qty: 1,
    subtotal: 70000,
    notes: null,
  },
];

export const demoPayments = [
  {
    id: "demo-payment-1",
    orderId: "demo-order-3",
    amount: 70000,
    method: "QRIS" as PaymentMethod,
    createdAt: hourAgo,
  },
  {
    id: "demo-payment-2",
    orderId: "demo-order-4",
    amount: 115000,
    method: "CASH" as PaymentMethod,
    createdAt: twoHoursAgo,
  },
];

const demoOrderRows = [
  {
    id: "demo-order-1",
    tableId: "demo-table-1",
    userId: "demo-user-waiter",
    memberId: "demo-member-1",
    queueId: null,
    customerName: null,
    source: "WAITER" as OrderSource,
    totalAmount: 180000,
    status: "PREPARING" as OrderStatus,
    notes: "Tamu minta kursi dekat jendela",
    createdAt: hourAgo,
    updatedAt: now,
  },
  {
    id: "demo-order-2",
    tableId: "demo-table-3",
    userId: null,
    memberId: null,
    queueId: "demo-queue-1",
    customerName: "Rina",
    source: "CUSTOMER" as OrderSource,
    totalAmount: 75000,
    status: "READY" as OrderStatus,
    notes: "Self-order dari QR meja",
    createdAt: hourAgo,
    updatedAt: now,
  },
  {
    id: "demo-order-3",
    tableId: "demo-table-2",
    userId: "demo-user-kasir",
    memberId: "demo-member-2",
    queueId: null,
    customerName: null,
    source: "WAITER" as OrderSource,
    totalAmount: 70000,
    status: "COMPLETED" as OrderStatus,
    notes: null,
    createdAt: twoHoursAgo,
    updatedAt: hourAgo,
  },
];

export const demoOrders = demoOrderRows.map((order) => ({
  ...order,
  table: tableById.get(order.tableId) ?? demoTables[0],
  user: order.userId ? userById.get(order.userId) ?? null : null,
  member: order.memberId ? memberById.get(order.memberId) ?? null : null,
  payment: demoPayments.find((payment) => payment.orderId === order.id) ?? null,
  orderItems: demoOrderDetails
    .filter((item) => item.orderId === order.id)
    .map((item) => ({
      ...item,
      menu: {
        ...(menuById.get(item.menuId) ?? demoMenus[0]),
        category: categoryById.get(menuById.get(item.menuId)?.categoryId ?? "") ?? demoCategories[0],
      },
    })),
}));

export const demoQueues = [
  {
    id: "demo-queue-1",
    name: "Rina",
    phone: "081277788899",
    pax: 3,
    status: "CALLED" as QueueStatus,
    notes: "Prefer area indoor",
    createdAt: hourAgo,
    updatedAt: now,
  },
  {
    id: "demo-queue-2",
    name: "Bima",
    phone: "081255566677",
    pax: 2,
    status: "WAITING" as QueueStatus,
    notes: null,
    createdAt: now,
    updatedAt: now,
  },
];

export function findDemoUser(username: string, password: string) {
  return demoUsers.find((user) => user.username === username && user.password === password) ?? null;
}

export function getDemoMenusWithCategories() {
  return demoMenus.map((menu) => ({
    ...menu,
    category: categoryById.get(menu.categoryId) ?? demoCategories[0],
  }));
}

export function getDemoCategoriesWithMenuCount() {
  return demoCategories.map((category) => ({
    ...category,
    _count: {
      menus: demoMenus.filter((menu) => menu.categoryId === category.id).length,
    },
  }));
}

export function getDemoTablesWithOrders() {
  return demoTables.map((table) => ({
    ...table,
    orders: demoOrders
      .filter(
        (order) =>
          order.tableId === table.id &&
          ["PENDING", "PREPARING", "READY", "SERVED"].includes(order.status),
      )
      .slice(0, 1),
  }));
}

export function getDemoTableById(id: string) {
  const table = demoTables.find((item) => item.id === id || item.tableNo.toString() === id);

  if (!table) return null;

  return {
    ...table,
    orders: demoOrders.filter(
      (order) =>
        order.tableId === table.id &&
        ["PENDING", "PREPARING", "READY", "SERVED"].includes(order.status),
    ),
  };
}

export function getDemoPaymentSummary() {
  const totalCash = demoPayments
    .filter((payment) => payment.method === "CASH")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalQris = demoPayments
    .filter((payment) => payment.method === "QRIS")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return {
    totalTransactions: demoPayments.length,
    totalAmount: totalCash + totalQris,
    totalCash,
    totalQris,
  };
}

