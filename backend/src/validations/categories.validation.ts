import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export async function validateCategoryName(body: unknown) {
  try {
    return await z.object({ 
      name: z.string()
        .min(3, "Le nom doit contenir au minimum 3 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Le nom ne doit contenir que des lettres")
    }).parseAsync(body);
  } catch (error: unknown) {
    console.error("Erreur de validation:", error);
    throw new BadRequestError("Nom de catégorie invalide");
  }
}