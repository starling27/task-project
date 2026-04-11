import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Demo User
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin'
    }
  });

  // Create Project
  const project = await prisma.project.upsert({
    where: { name: 'Sample Project' },
    update: {},
    create: {
      name: 'Sample Project',
      description: 'A sample project for testing'
    }
  });

  // Create WorkflowStates for Sample Project
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: project.id, name: 'unassigned' } },
    update: {},
    create: { projectId: project.id, name: 'unassigned', isInitial: true, order: 0 }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: project.id, name: 'assigned' } },
    update: {},
    create: { projectId: project.id, name: 'assigned', order: 1 }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: project.id, name: 'in_progress' } },
    update: {},
    create: { projectId: project.id, name: 'in_progress', order: 2 }
  });
  await prisma.workflowState.upsert({
    where: { projectId_name: { projectId: project.id, name: 'done' } },
    update: {},
    create: { projectId: project.id, name: 'done', isFinal: true, order: 3 }
  });

  // Create Epic
  const epic = await prisma.epic.upsert({
    where: { projectId_name: { projectId: project.id, name: 'Initial Epic' } },
    update: {},
    create: {
      projectId: project.id,
      name: 'Initial Epic',
      description: 'First epic in the project'
    }
  });

  // Create Story
  await prisma.story.create({
    data: {
      epicId: epic.id,
      title: 'First User Story',
      description: 'As a user, I want to see stories in an accordion.',
      status: 'unassigned',
      priority: 'high',
      storyPoints: 5,
      assigneeId: user.id
    }
  });

  console.log('✅ Demo Data Seeded');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
