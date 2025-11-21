import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

/**
 * Transforme "" => undefined  
 * Car FormData envoie "" quand un champ est vide.
 */
const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

/**
 * Schéma pour les BROUILLONS
 * - titre obligatoire
 * - tout le reste optionnel
 * - "" accepté pour tous les champs
 */
export const draftRecipeSchema = z.object({

  /** 🔵 TITRE OBLIGATOIRE */
  title: z.string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères"),

  /** 🟡 Champs optionnels avec preprocess */
  category_id: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),

  movie_id: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),

  number_of_person: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),

  preparation_time: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().optional()
  ),

  description: z.preprocess(
    emptyToUndefined,
    z.string().optional()
  ),

  ingredients: z.preprocess(
    emptyToUndefined,
    z.string().optional()
  ),

  preparation_steps: z.preprocess(
    emptyToUndefined,
    z.string().optional()
  ),

  status: z.preprocess(
    emptyToUndefined,
    z.enum(["draft", "published"]).optional()
  ),
});

/**
 * Validation
 */
export async function validateDraftRecipe(body: unknown) {
  try {
    return await draftRecipeSchema.parseAsync(body);
  } catch (error) {
    console.error("Erreur validation draft :", error);
    throw new BadRequestError("Données invalides pour le brouillon");
  }
}
