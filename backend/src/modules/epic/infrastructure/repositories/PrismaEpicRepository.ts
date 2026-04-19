import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { Epic } from '../../domain/entities/Epic.js';
import { EpicRepository } from '../../domain/repositories/EpicRepository.js';
import { EpicMapper } from '../mappers/EpicMapper.js';

export class PrismaEpicRepository implements EpicRepository {
  async findById(id: string): Promise<Epic | null> {
    const prismaEpic = await prisma.epic.findFirst({
      where: { id, deletedAt: null }
    });
    return prismaEpic ? EpicMapper.toDomain(prismaEpic) : null;
  }

  async findByNameInProject(projectId: string, name: string): Promise<Epic | null> {
    // We only check for active/draft epics. 
    // If an epic is archived or soft-deleted, its name is considered 'released' for reuse.
    const prismaEpic = await prisma.epic.findFirst({
      where: { 
        projectId, 
        name,
        deletedAt: null,
        NOT: {
          status: 'archived'
        }
      }
    });
    return prismaEpic ? EpicMapper.toDomain(prismaEpic) : null;
  }

  async findByProjectId(projectId: string): Promise<Epic[]> {
    const prismaEpics = await prisma.epic.findMany({
      where: { projectId, deletedAt: null }
    });
    return prismaEpics.map(EpicMapper.toDomain);
  }

  async findAll(): Promise<Epic[]> {
    const prismaEpics = await prisma.epic.findMany({
      where: { deletedAt: null }
    });
    return prismaEpics.map(EpicMapper.toDomain);
  }

  async save(epic: Epic): Promise<Epic> {
    const data = EpicMapper.toPersistence(epic);
    let prismaEpic;

    if (epic.id) {
      prismaEpic = await prisma.epic.update({
        where: { id: epic.id },
        data: {
          name: data.name,
          description: data.description,
          status: data.status,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaEpic = await prisma.epic.create({
        data: {
          name: data.name!,
          projectId: data.projectId!,
          description: data.description,
          status: data.status || 'active',
          deletedAt: data.deletedAt
        }
      });
    }

    return EpicMapper.toDomain(prismaEpic);
  }

  async delete(id: string): Promise<void> {
    await prisma.epic.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.story.updateMany({
        where: { epicId: id, deletedAt: null },
        data: { deletedAt: now }
      });

      await tx.epic.update({ 
        where: { id }, 
        data: { deletedAt: now } 
      });
    });
  }
}
