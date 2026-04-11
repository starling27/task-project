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
