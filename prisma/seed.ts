import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.workflowState.upsert({
    where: { name: 'unassigned' },
    update: {},
    create: { name: 'unassigned', isInitial: true, order: 0 }
  });
  await prisma.workflowState.upsert({
    where: { name: 'assigned' },
    update: {},
    create: { name: 'assigned', order: 1 }
  });
  await prisma.workflowState.upsert({
    where: { name: 'in_progress' },
    update: {},
    create: { name: 'in_progress', order: 2 }
  });
  await prisma.workflowState.upsert({
    where: { name: 'done' },
    update: {},
    create: { name: 'done', isFinal: true, order: 3 }
  });
  console.log('✅ Workflow States Seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
