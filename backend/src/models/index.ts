import { PrismaClient } from '../../prisma/generated/client.ts';

// On créer un client de connexion vers la base de données
export const prisma = new PrismaClient();
