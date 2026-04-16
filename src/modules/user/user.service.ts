import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getAll() {
    return prisma.user.findMany({
      where: { deletedAt: null }
    });
  }

  async getById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.deletedAt) return null;
    return user;
  }

  async create(data: { email: string; name: string; role?: string; avatarUrl?: string }) {
    return prisma.user.create({ data });
  }

  async findOrCreateUser(data: { provider: string; providerId: string; email: string; name: string; avatarUrl?: string }) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { provider: data.provider, providerId: data.providerId },
          { email: data.email }
        ]
      }
    });

    if (user) {
      // Update provider info if not set
      if (!user.provider || !user.providerId) {
        return prisma.user.update({
          where: { id: user.id },
          data: {
            provider: data.provider,
            providerId: data.providerId,
            avatarUrl: user.avatarUrl || data.avatarUrl
          }
        });
      }
      return user;
    }

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        provider: data.provider,
        providerId: data.providerId,
        avatarUrl: data.avatarUrl,
        role: 'member'
      }
    });
  }

  async registerWithProvider(data: { email: string; name: string; provider: string; providerId: string; avatarUrl?: string }) {
    // Check if user already exists with this email
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      // If user exists, we link the provider if not already linked
      return prisma.user.update({
        where: { id: existingUser.id },
        data: {
          provider: data.provider,
          providerId: data.providerId,
          avatarUrl: existingUser.avatarUrl || data.avatarUrl
        }
      });
    }

    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        provider: data.provider,
        providerId: data.providerId,
        avatarUrl: data.avatarUrl,
        role: 'member'
      }
    });
  }

  async updateEmail(id: string, email: string) {
    return prisma.user.update({
      where: { id },
      data: { email }
    });
  }

  async delete(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error('User not found');

    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }
}
