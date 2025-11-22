import z from "zod";
import { BadRequestError } from "../lib/errors.ts";
import { Role } from "@prisma/client";

// Schémas
const passwordSchema = z.string()
  .trim()
  .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
  .regex(/[a-z]/, { message: "Le mot de passe doit contenir au moins une minuscule" })
  .regex(/[A-Z]/, { message: "Le mot de passe doit contenir au moins une majuscule" })
  .regex(/[0-9]/, { message: "Le mot de passe doit contenir au moins un chiffre" })
  .regex(/[!@#$%^&*]/, { message: "Le mot de passe doit contenir au moins un caractère spécial: ! @ # $ % ^ & *" });

const registerUserSchema = z.object({
  username: z.string()
    .trim()
    .min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" })
    .max(50, { message: "Le nom d'utilisateur ne peut pas dépasser 50 caractères" })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores" }),
  
  email: z.email({ message: "L'adresse email n'est pas valide" }) // z.email() gère déjà le .trim()
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" }),
  
  password: passwordSchema,
  
  // z.literal() accepte uniquement la valeur exacte spécifiée, rien d'autre
  age_declaration: z.literal(true, {
    message: "Vous devez déclarer avoir l'âge requis"
  }),
  
  cgu_accepted: z.literal(true, {
    message: "Vous devez accepter les conditions générales d'utilisation"
  })
});

const updateUserRoleSchema = z.object({
  role: z.enum([Role.admin, Role.user], {
    message: "Le rôle doit être 'admin' ou 'user'"
  })
});

const updatePasswordSchema = z.object({
  // Pourquoi validation moins stricte pour oldPassword ?
  // On vérifie juste qu'il existe (non vide)
  // La vraie validation se fait en comparant avec la BDD via argon2.verify()
  // Si l'utilisateur avait un ancien mot de passe faible (avant tes règles Zod), il doit pouvoir le saisir pour le changer
  oldPassword: z.string()
    .trim()
    .min(1, { message: "L'ancien mot de passe est obligatoire" }),
  newPassword: passwordSchema
});

// Fonctions de validation
export async function validateRegisterUser(data: unknown) {
  try {
    return await registerUserSchema.parseAsync(data);
  } catch {
    throw new BadRequestError("Données d'inscription invalides");
  }
}

export async function validateUpdateUserRole(data: unknown) {
  try {
    return await updateUserRoleSchema.parseAsync(data);
  } catch {
    throw new BadRequestError("Rôle invalide");
  }
}

export async function validateUpdatePassword(data: unknown) {
  try {
    return await updatePasswordSchema.parseAsync(data);
  } catch {
    throw new BadRequestError("Mots de passe invalides");
  }
}

export async function validatePassword(password: unknown) {
  try {
    return await passwordSchema.parseAsync(password);
  } catch {
    throw new BadRequestError("Mot de passe invalide");
  }
}