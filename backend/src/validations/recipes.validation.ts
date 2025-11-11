import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export async function validateGetAllRecipesQueryParams(query: unknown) {
  try {
    return await z.object({ 
      userId: z.coerce.number().int().positive().optional(),
      categoryId: z.coerce.number().int().positive().optional(),
      movieId: z.coerce.number().int().positive().optional(),
    }).parseAsync(query);
  } catch {
    throw new BadRequestError("Paramètres de recherches invalides");
  }
}