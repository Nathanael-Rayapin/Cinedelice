import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { BadRequestError,NotFoundError,ForbiddenError} from "../lib/errors.ts";


//========== Lister les utilisateurs (admin)  =============
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    omit: { password: true }
  });
  res.json(users);
};
//======= Modifier le Role d'un User (admin)==========
export async function updateUserRole(req: Request, res: Response) {
  const userId = Number(req.params.id);
  const { role } = req.body;

  // Vérifier que le rôle est valide
  if (role !== "admin" && role !== "user") {
    throw new BadRequestError("Le rôle doit être 'admin' ou 'user'.");
  }

  // Vérifier que l'utilisateur existe
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Utilisateur introuvable");
  }

  // Mettre à jour le rôle
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, username: true, email: true, role: true }
  });

  res.status(200).json({
    message: `Le rôle de ${updatedUser.username} a été mis à jour en ${updatedUser.role}`,
    user: updatedUser
  });
};
//========Supprimer un utilisateur (admin)==============
export async function deleteUser(req: Request, res: Response) {
  const userId = Number(req.params.id);

  // Vérifie si l'ID est valide
  if (isNaN(userId)) {
    throw new BadRequestError("ID d'utilisateur invalide");
  }

  // Vérifie si l'utilisateur existe
  const userToDelete = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userToDelete) {
    throw new NotFoundError("Utilisateur introuvable");
  }

  // Empêcher un admin de supprimer un autre admin (sauf lui-même)
  if (userToDelete.role === "admin" && userToDelete.id !== req.userId) {
    throw new ForbiddenError("Un administrateur ne peut pas supprimer un autre administrateur");
  }

  // Autoriser la suppression de soi-même ou d’un user
  await prisma.user.delete({
    where: { id: userId },
  });

  res.status(200).json({
    message: `L'utilisateur ${userToDelete.username} a été supprimé avec succès.`,
  });
}
