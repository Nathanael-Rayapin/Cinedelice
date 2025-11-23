import { PrismaClient } from '../../prisma/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
export type { Prisma } from '../../prisma/generated/prisma/client';
export { Role } from '../../prisma/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});

export const prisma = new PrismaClient({ adapter });