import { PrismaClient, UserRole, TableStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        password: "admin123",
        role: UserRole.ADMIN,
        name: "Manajer Somchai",
        email: "admin@thaicafe.com",
      },
    }),
    prisma.user.upsert({
      where: { username: "waiter" },
      update: {},
      create: {
        username: "waiter",
        password: "waiter123",
        role: UserRole.WAITER,
        name: "Pelayan Nop",
        email: "waiter@thaicafe.com",
      },
    }),
    prisma.user.upsert({
      where: { username: "kitchen" },
      update: {},
      create: {
        username: "kitchen",
        password: "kitchen123",
        role: UserRole.KITCHEN,
        name: "Chef Lek",
        email: "kitchen@thaicafe.com",
      },
    }),
    prisma.user.upsert({
      where: { username: "kasir" },
      update: {},
      create: {
        username: "kasir",
        password: "kasir123",
        role: UserRole.KASIR,
        name: "Kasir Mai",
        email: "kasir@thaicafe.com",
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create Categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Hidangan Pembuka" },
      update: {},
      create: { name: "Hidangan Pembuka" },
    }),
    prisma.category.upsert({
      where: { name: "Hidangan Utama" },
      update: {},
      create: { name: "Hidangan Utama" },
    }),
    prisma.category.upsert({
      where: { name: "Sup" },
      update: {},
      create: { name: "Sup" },
    }),
    prisma.category.upsert({
      where: { name: "Minuman" },
      update: {},
      create: { name: "Minuman" },
    }),
  ]);
  console.log(`✅ Created ${categories.length} categories`);

  // Create Menus
  const menus = await Promise.all([
    prisma.menu.create({
      data: {
        name: "Spring Rolls",
        price: 45000,
        categoryId: categories[0].id,
        image: "https://images.unsplash.com/photo-1544510808-91bcbee1df55?auto=format&fit=crop&w=300&q=80",
      },
    }),
    prisma.menu.create({
      data: {
        name: "Pad Thai",
        price: 65000,
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=300&q=80",
      },
    }),
    prisma.menu.create({
      data: {
        name: "Tom Yum Goong",
        price: 75000,
        categoryId: categories[2].id,
        image: "https://images.unsplash.com/photo-1548943487-a79fe6509462?auto=format&fit=crop&w=300&q=80",
      },
    }),
    prisma.menu.create({
      data: {
        name: "Thai Iced Tea",
        price: 25000,
        categoryId: categories[3].id,
        image: "https://images.unsplash.com/photo-1626804475297-411d8c66c8e3?auto=format&fit=crop&w=300&q=80",
      },
    }),
    prisma.menu.create({
      data: {
        name: "Green Curry",
        price: 70000,
        categoryId: categories[1].id,
        image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=300&q=80",
      },
    }),
  ]);
  console.log(`✅ Created ${menus.length} menus`);

  // Create Tables
  const tables = await Promise.all([
    prisma.table.upsert({
      where: { tableNo: 1 },
      update: {},
      create: { tableNo: 1, capacity: 2, zone: "floor1", status: TableStatus.AVAILABLE },
    }),
    prisma.table.upsert({
      where: { tableNo: 2 },
      update: {},
      create: { tableNo: 2, capacity: 4, zone: "floor1", status: TableStatus.AVAILABLE },
    }),
    prisma.table.upsert({
      where: { tableNo: 3 },
      update: {},
      create: { tableNo: 3, capacity: 6, zone: "floor1", status: TableStatus.AVAILABLE },
    }),
    prisma.table.upsert({
      where: { tableNo: 4 },
      update: {},
      create: { tableNo: 4, capacity: 2, zone: "floor2", status: TableStatus.AVAILABLE },
    }),
    prisma.table.upsert({
      where: { tableNo: 5 },
      update: {},
      create: { tableNo: 5, capacity: 4, zone: "floor2", status: TableStatus.AVAILABLE },
    }),
  ]);
  console.log(`✅ Created ${tables.length} tables`);

  // Create Ingredients
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { name: "Bihun" },
      update: {},
      create: { name: "Bihun", unit: "kg", currentStock: 15.5, minStock: 5, costPerUnit: 20000 },
    }),
    prisma.ingredient.upsert({
      where: { name: "Udang" },
      update: {},
      create: { name: "Udang", unit: "kg", currentStock: 3.2, minStock: 5, costPerUnit: 150000 },
    }),
    prisma.ingredient.upsert({
      where: { name: "Teh Thai" },
      update: {},
      create: { name: "Teh Thai", unit: "kg", currentStock: 2, minStock: 1, costPerUnit: 80000 },
    }),
    prisma.ingredient.upsert({
      where: { name: "Susu Kental Manis" },
      update: {},
      create: { name: "Susu Kental Manis", unit: "kaleng", currentStock: 10, minStock: 5, costPerUnit: 15000 },
    }),
  ]);
  console.log(`✅ Created ${ingredients.length} ingredients`);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
