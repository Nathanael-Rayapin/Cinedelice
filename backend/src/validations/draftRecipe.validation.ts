import { BadRequestError } from "../lib/errors.ts";
import { updateRecipeSchema } from "./recipes.validation.ts";
import { z } from "zod";

export const draftRecipeSchema = updateRecipeSchema.extend({
  title: z.string()
    .trim()
    .min(3, "Le titre doit contenir au moins 3 caractères")
});

/**
 * Fonction de validation pour les brouillons
 */
export async function validateDraftRecipe(body: unknown) {
  try {
    return await draftRecipeSchema.parseAsync(body);
  } catch (error) {
    console.error("Erreur validation draft :", error);
    throw new BadRequestError("Données invalides pour le brouillon");
  }
}