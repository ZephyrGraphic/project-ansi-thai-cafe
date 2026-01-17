
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:pD2MLTzjKMAuvLYR@db.buqlgrjdaccvzzvxkwgn.supabase.co:5432/postgres" // Using the user provided string
    }
  }
});

async function main() {
  try {
    console.log("Attempting to connect...");
    await prisma.$connect();
    console.log("Connection successful!");
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
