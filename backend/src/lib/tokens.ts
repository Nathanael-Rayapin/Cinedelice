import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config/config.ts";
import { UnauthorizedError } from "./errors.ts";
import type { Role } from "@prisma/client";

// === Configuration ===
const TOKEN_EXPIRATION = "1h";

// === Générer un token JWT simple ===
export function generateAccessToken(userId: number, role: Role) {
  const payload = { userId, role };

  const token = jwt.sign(payload, config.jwtSecret, {//creation du token chiffré
    expiresIn: TOKEN_EXPIRATION,
  });
  return {token};
}

// === Vérifier et décoder un token ===
export function verifyAndDecodeJWT(accessToken: string): AuthPayload {
  try {
    const jwtPayload = jwt.verify(accessToken, config.jwtSecret) as AuthPayload;
    return jwtPayload;
  } catch (error) {
    console.error(error);
    throw new UnauthorizedError("Token invalide ou expiré");
  }
}

// === Interface du contenu du token ===
export interface AuthPayload extends JwtPayload {
  userId: number;
  role: Role;
}
