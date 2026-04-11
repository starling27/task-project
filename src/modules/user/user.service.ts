import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getAll() {
    return prisma.user.findMany();
  }

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: { email: string; name: string; role?: string; avatarUrl?: string }) {
    return prisma.user.create({ data });
  }
}
