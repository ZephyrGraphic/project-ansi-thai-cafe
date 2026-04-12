import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const table = await prisma.table.findFirst();
  if (table) {
    console.log("TABLE_ID=" + table.id);
  } else {
    console.log("No tables found.");
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
