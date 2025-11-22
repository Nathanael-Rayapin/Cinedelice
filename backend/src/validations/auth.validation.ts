import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

// Schéma pour la connexion
// Pour le login, on valide juste que l'email est valide et que le password n'est pas vide
// On ne valide PAS la complexité du password au login (ça a déjà été fait à l'inscription)
const loginUserSchema = z.object({
  email: z.email({ message: "L'adresse email n'est pas valide" }) // z.email() gère déjà le .trim()
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" }),
  
  password: z.string()
    .trim()
    .min(1, { message: "Le mot de passe est obligatoire" })
});

// Fonction de validation
export async function validateLoginUser(data: unknown) {
  try {
    return await loginUserSchema.parseAsync(data);
  } catch {
    throw new BadRequestError("Données de connexion invalides");
  }
}

// NB. getMe n'a pas besoin de validation Zod (pas de body, juste un token dans le header)

