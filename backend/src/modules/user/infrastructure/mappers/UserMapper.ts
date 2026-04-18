import { User as PrismaUser } from '@prisma/client';
import { User } from '../../domain/entities/User.js';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.email,
      prismaUser.name || '',
      prismaUser.role,
      prismaUser.provider || undefined,
      prismaUser.providerId || undefined,
      prismaUser.avatarUrl || undefined,
      prismaUser.id,
      prismaUser.createdAt,
      prismaUser.updatedAt,
      prismaUser.deletedAt
    );
  }

  static toPersistence(user: User): Partial<PrismaUser> {
    return {
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      providerId: user.providerId,
      avatarUrl: user.avatarUrl,
      deletedAt: user.deletedAt
    };
  }
}
