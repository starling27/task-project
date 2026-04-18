import { Project as PrismaProject } from '@prisma/client';
import { Project } from '../../domain/entities/Project.js';

export class ProjectMapper {
  static toDomain(prismaProject: PrismaProject): Project {
    return new Project(
      prismaProject.name,
      prismaProject.description || undefined,
      prismaProject.id,
      prismaProject.createdAt,
      prismaProject.updatedAt,
      prismaProject.deletedAt
    );
  }

  static toPersistence(project: Project): Partial<PrismaProject> {
    return {
      name: project.name,
      description: project.description,
      deletedAt: project.deletedAt
    };
  }
}
