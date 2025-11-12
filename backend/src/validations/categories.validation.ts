import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export async function validateCategoryName(body: unknown) {
  try {
    return await z.object({ 
      name: z.string()
        .trim()
        .min(3, "Le nom doit contenir au minimum 3 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Le nom ne doit contenir que des lettres")
        .refine(val => val.length > 0, {
          message: "Le nom ne peut pas être uniquement des espaces", }),
        
    }).parseAsync(body);
  } catch (error: unknown) {
    console.error("Erreur de validation:", error);
    throw new BadRequestError("Nom de catégorie invalide");
  }
}