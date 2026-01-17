
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:pD2MLTzjKMAuvLYR@db.buqlgrjdaccvzzvxkwgn.supabase.co:6543/postgres?pgbouncer=true" 
    }
  }
});

async function main() {
  try {
    console.log("Attempting to connect to Port 6543...");
    await prisma.$connect();
    console.log("Connection to 6543 successful!");
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    
  } catch (e) {
    console.error("Connection failed:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
