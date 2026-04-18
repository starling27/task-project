import { prisma } from '../../../../core/infrastructure/PrismaClient.js';
import { User } from '../../domain/entities/User.js';
import { UserRepository } from '../../domain/repositories/UserRepository.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class PrismaUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: { id, deletedAt: null }
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: { email, deletedAt: null }
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    const prismaUser = await prisma.user.findFirst({
      where: { provider, providerId, deletedAt: null }
    });
    return prismaUser ? UserMapper.toDomain(prismaUser) : null;
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await prisma.user.findMany({
      where: { deletedAt: null }
    });
    return prismaUsers.map(UserMapper.toDomain);
  }

  async save(user: User): Promise<User> {
    const data = UserMapper.toPersistence(user);
    let prismaUser;

    if (user.id) {
      prismaUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: data.email,
          name: data.name,
          role: data.role,
          provider: data.provider,
          providerId: data.providerId,
          avatarUrl: data.avatarUrl,
          deletedAt: data.deletedAt
        }
      });
    } else {
      prismaUser = await prisma.user.create({
        data: {
          email: data.email!,
          name: data.name!,
          role: data.role || 'member',
          provider: data.provider,
          providerId: data.providerId,
          avatarUrl: data.avatarUrl,
          deletedAt: data.deletedAt
        }
      });
    }

    return UserMapper.toDomain(prismaUser);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
