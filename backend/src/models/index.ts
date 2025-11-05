import { PrismaClient } from '../../prisma/generated/client.ts';

//  On réexporte tous les types générés par Prisma (User, Role, etc.)
export * from '../../prisma/generated/client.ts';

// On créer un client de connexion vers la base de données
export const prisma = new PrismaClient();
