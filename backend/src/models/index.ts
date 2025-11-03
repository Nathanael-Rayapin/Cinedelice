import { PrismaClient } from "@prisma/client";

// On exporte interfaces utiles du module
export * from "@prisma/client";

// On créer un client de connexion vers la base de données
export const prisma = new PrismaClient();
