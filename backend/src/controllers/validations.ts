import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export async function parseIdFromParams(id: unknown) {
  try {
    return await z.coerce.number().int().min(1).parseAsync(id);
  } catch {
    throw new BadRequestError("ID invalide");
  }
}