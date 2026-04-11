import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Find or create a default project to associate workflow states with
  const defaultProject = await prisma.project.upsert({
    where: { name: 'Default Project for Workflow' },
    update: {},
    create: {
      name: 'Default Project for Workflow',
      description: 'Project to hold default workflow states'
    }
  });

  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: defaultProject.id, name: 'unassigned' } },
    update: {},
    create: { 
      projectId: defaultProject.id,
      name: 'unassigned', 
      isInitial: true, 
      order: 0 
    }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: defaultProject.id, name: 'assigned' } },
    update: {},
    create: { 
      projectId: defaultProject.id,
      name: 'assigned', 
      order: 1 
    }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: defaultProject.id, name: 'in_progress' } },
    update: {},
    create: { 
      projectId: defaultProject.id,
      name: 'in_progress', 
      order: 2 
    }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: defaultProject.id, name: 'done' } },
    update: {},
    create: { 
      projectId: defaultProject.id,
      name: 'done', 
      isFinal: true, 
      order: 3 
    }
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
