import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { Project } from '../../domain/entities/Project.js';
import { ProjectRepository } from '../../domain/repositories/ProjectRepository.js';
import { ProjectMapper } from '../mappers/ProjectMapper.js';
import { DEFAULT_WORKFLOW_STATES } from '../../domain/entities/Project.js';

export class PrismaProjectRepository implements ProjectRepository {
  async findById(id: string): Promise<Project | null> {
    const prismaProject = await prisma.project.findFirst({
      where: { id, deletedAt: null }
    });
    return prismaProject ? ProjectMapper.toDomain(prismaProject) : null;
  }

  async findByName(name: string): Promise<Project | null> {
    const prismaProject = await prisma.project.findFirst({
      where: { name, deletedAt: null }
    });
    return prismaProject ? ProjectMapper.toDomain(prismaProject) : null;
  }

  async findAll(): Promise<Project[]> {
    const prismaProjects = await prisma.project.findMany({
      where: { deletedAt: null }
    });
    return prismaProjects.map(ProjectMapper.toDomain);
  }

  async save(project: Project): Promise<Project> {
    const data = ProjectMapper.toPersistence(project);
    let prismaProject;

    if (project.id) {
      prismaProject = await prisma.project.update({
        where: { id: project.id },
        data: {
          name: data.name,
          description: data.description,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaProject = await prisma.project.create({
        data: {
          name: data.name!,
          description: data.description,
          deletedAt: data.deletedAt
        }
      });
    }

    return ProjectMapper.toDomain(prismaProject);
  }

  async createWithDefaultWorkflow(project: Project): Promise<Project> {
    const data = ProjectMapper.toPersistence(project);
    
    const prismaProject = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          name: data.name!,
          description: data.description
        }
      });

      await tx.workflowState.createMany({
        data: DEFAULT_WORKFLOW_STATES.map((state) => ({
          projectId: created.id,
          name: state.name,
          color: state.color,
          isDefault: state.isDefault,
          isInitial: state.isInitial,
          isFinal: state.isFinal,
          order: state.order
        }))
      });

      return created;
    });

    return ProjectMapper.toDomain(prismaProject);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      const epics = await tx.epic.findMany({
        where: { projectId: id, deletedAt: null },
        select: { id: true }
      });
      const epicIds = epics.map(e => e.id);

      if (epicIds.length > 0) {
        await tx.story.updateMany({
          where: { epicId: { in: epicIds }, deletedAt: null },
          data: { deletedAt: now }
        });

        await tx.epic.updateMany({
          where: { projectId: id, deletedAt: null },
          data: { deletedAt: now }
        });
      }

      await tx.project.update({ 
        where: { id }, 
        data: { deletedAt: now } 
      });
    });
  }
}
