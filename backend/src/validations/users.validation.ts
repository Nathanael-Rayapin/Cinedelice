import z from "zod";
import { BadRequestError } from "../lib/errors.ts";

export async function validatePassword(password: unknown) {
  try {
    return await z.string()
      .min(8, { message: "Password should be at least 8 characters long" })
      .regex(/[a-z]/, { message: "Password should contain at least one lowercase letter" })
      .regex(/[A-Z]/, { message: "Password should contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Password should contain at least one number" })
      .regex(/[!@#$%^&*]/, { message: "Password should contain at least one special character: ! @ # $ % ^ & *" })
      .parseAsync(password);
  } catch {
    throw new BadRequestError("Mot de passe invalide");
  }
}
