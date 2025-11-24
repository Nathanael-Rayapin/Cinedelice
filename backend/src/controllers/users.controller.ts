import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { NotFoundError, ForbiddenError, ConflictError, UnauthorizedError} from "../lib/errors.ts";
import { Role } from "../models/index.ts";
import * as argon2 from "argon2";
import { parseIdFromParams, validateRegisterUser, validateUpdateUserRole, validateUpdatePassword } from "../validations/index.ts";

// Lister tous les utilisateurs
export async function getAllUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      created_at: true
    }
  });
  return res.status(200).json(users);
}

// Créer un nouvel utilisateur
export async function registerUser(req: Request, res: Response) {
  // On récupère les données envoyées par le client dans le corps de la requête
  const { username, email, password, age_declaration, cgu_accepted } = await validateRegisterUser(req.body);

  // Vérifier que l'email n'est pas déjà utilisé
  const alreadyExistingUser = await prisma.user.findFirst({ where: { email } });
  if (alreadyExistingUser) {
    throw new ConflictError("Une erreur est survenue");
  }

  // Hasher le mot de passe (argon2) pour éviter de le stocker en clair
  const hash = await argon2.hash(password);

  // =====Créer l'utilisateur en BDD=====
  const createdUser = await prisma.user.create({ 
    data: {
      username,
      email,
      password: hash,
      age_declaration,
      cgu_accepted,
      role: "user", // par défaut, tout nouvel utilisateur est "user"
    }});

  // Renvoyer les infos de l'utilisateur au client (sans son MDP)
  return res.status(201).location(`/api/users/${createdUser.id}`)
    .json({
      id: createdUser.id,
      username: createdUser.username,
      email: createdUser.email,
      role: createdUser.role,
      created_at: createdUser.created_at
    });
}

// Modifier le rôle d'un utilisateur
export async function updateUserRole(req: Request, res: Response) {
  const targetUserId = await parseIdFromParams(req.params.id); // l’utilisateur ciblé
  const adminId = req.currentUserId; // l’admin connecté (du token)

  const { role } = await validateUpdateUserRole(req.body);

  // Vérifier que l'utilisateur existe
  const userToUpdate = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!userToUpdate) {
    throw new NotFoundError("Utilisateur introuvable");
  }
  //  Empêcher un admin de modifier le rôle d’un autre admin
  if (userToUpdate.role === Role.admin && userToUpdate.id !== adminId) {
    throw new ForbiddenError("Un administrateur ne peut pas modifier le rôle d’un autre administrateur.");
  }

  // Mettre à jour le rôle
  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { role },
    select: { id: true, username: true, email: true, role: true }
  });

  // Retourne 200 OK avec la ressource modifiée
  return res.status(200).json(updatedUser);
}

// Supprimer un utilisateur (Admin)
export async function deleteUser(req: Request, res: Response) {
  const targetUserId = await parseIdFromParams(req.params.id); // utilisateur à supprimer
  const adminId = req.currentUserId; // admin connecté

  // Vérifie si l'utilisateur existe
  const userToDelete = await prisma.user.findUnique({
    //select * from "user" where id = 9;
    where: { id: targetUserId },
  });

  if (!userToDelete) {
    throw new NotFoundError("Utilisateur introuvable");
  }

  // Empêcher un admin de supprimer un autre admin (sauf lui-même)
  if (userToDelete.role === Role.admin && userToDelete.id !== adminId) {
    throw new ForbiddenError("Un administrateur ne peut pas supprimer un autre administrateur");
  }

  // Autoriser la suppression de soi-même ou d’un user
  await prisma.user.delete({
    where: { id: targetUserId },
  });

  // Retourne 204 No Content après suppression réussie
  return res.status(204).send();
}

// Modifier son mot de passe
export async function updatePassword(req: Request, res: Response) {
  const userId = req.currentUserId; // récupéré depuis le token (middleware)
  const { oldPassword, newPassword } = await validateUpdatePassword(req.body);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Utilisateur introuvable.");

  const isMatching = await argon2.verify(user.password, oldPassword);
  if (!isMatching) {
    throw new UnauthorizedError("L'ancien mot de passe est incorrect.");
  }

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Retourne 200 OK sans contenu sensible
  return res.status(200).json({
    message: "Votre mot de passe a bien été modifié"
  });
}

// Supprimer son propre compte
export async function deleteAccount(req: Request, res: Response) {
  const userId = req.currentUserId;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("Utilisateur introuvable.");

  await prisma.user.delete({ where: { id: userId } });

  // Retourne 204 No Content après suppression réussie
  return res.status(204).send("Votre compte a bien été supprimé");
}
