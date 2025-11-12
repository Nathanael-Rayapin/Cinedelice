import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export const createRecipeSchema = z.object({
  category_id: z.number().int().positive(),
  movie_id: z.number()
    .int("L'ID du film doit être un entier")
    .positive("L'ID du film doit être positif"),
  title: z.string()
    .min(3, "Le titre doit contenir au minimum 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ0-9\s\-',.()]+$/,
      "Le titre ne peut contenir que des lettres, chiffres, espaces et caractères basiques (- ' , . ())"
    )
    .trim(), // Supprime les espaces au début et à la fin
  number_of_person: z.number()
    .int("Le nombre de personnes doit être un entier")
    .min(1, "La recette doit servir au moins 1 personne")
    .max(50, "Le nombre de personnes ne peut pas dépasser 50"),
  preparation_time: z.number()
    .int("Le temps de préparation doit être un entier")
    .min(1, "Le temps de préparation doit être d'au moins 1 minute")
    .max(240, "Le temps de préparation ne peut pas dépasser 4 heures (240 minutes)"),
  description: z.string()
    .min(10, "La description doit contenir au minimum 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .trim()
    .optional(),
  image: z.url("L'image doit être une URL valide")
    .regex(
      /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i,
      "L'URL doit pointer vers une image (jpg, jpeg, png, webp, gif)"
    )
    .max(2000, "L'URL de l'image est trop longue"),
  ingredients: z.string()
    .min(10, "Les ingrédients doivent contenir au minimum 10 caractères")
    .max(5000, "Les ingrédients ne peuvent pas dépasser 5000 caractères")
    .trim()
    .refine(
      (val) => val.split('\n').filter(line => line.trim().length > 0).length >= 2,
      "La recette doit contenir au moins 2 ingrédients (un par ligne)"
    ),
  preparation_steps: z.string()
    .min(20, "Les étapes de préparation doivent contenir au minimum 20 caractères")
    .max(10000, "Les étapes de préparation ne peuvent pas dépasser 10000 caractères")
    .trim()
    .refine(
      (val) => val.split('\n').filter(line => line.trim().length > 0).length >= 2,
      "La recette doit contenir au moins 2 étapes de préparation (une par ligne)"
    ),
  status: z.enum(["draft", "published"]).default("draft"),
});

export const updateRecipeSchema = createRecipeSchema.partial();

export async function validateCreateRecipe(body: unknown) {
  try {
    return await createRecipeSchema.parseAsync(body);
  } catch (error: unknown) {
    console.error("Erreur de validation:", error);
    throw new BadRequestError("Données de recette invalides");
  }
}

export async function validateUpdateRecipe(body: unknown) {
  try {
    return await updateRecipeSchema.parseAsync(body);
  } catch (error: unknown) {
    console.error("Erreur de validation:", error);
    throw new BadRequestError("Données de mise à jour invalides");
  }
}
