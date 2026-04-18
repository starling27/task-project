import { Epic as PrismaEpic } from '@prisma/client';
import { Epic } from '../../domain/entities/Epic.js';

export class EpicMapper {
  static toDomain(prismaEpic: PrismaEpic): Epic {
    return new Epic(
      prismaEpic.name,
      prismaEpic.projectId,
      prismaEpic.description || undefined,
      prismaEpic.status,
      prismaEpic.id,
      prismaEpic.createdAt,
      prismaEpic.updatedAt,
      prismaEpic.deletedAt
    );
  }

  static toPersistence(epic: Epic): Partial<PrismaEpic> {
    return {
      name: epic.name,
      description: epic.description,
      projectId: epic.projectId,
      status: epic.status,
      deletedAt: epic.deletedAt
    };
  }
}
