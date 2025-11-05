import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config.ts";
import { UnauthorizedError } from "./errors.ts";
import type { Role } from "../models/index.ts";

// === Configuration ===
const ONE_HOUR_IN_MILLISECONDS = 1 * 60 * 60 * 1000;

// === Générer un token JWT simple ===
export function generateAccessToken(userId: number, role: Role) {
  const payload = { userId, role };

  const token = jwt.sign(payload, config.jwtSecret, {//creation du token chiffré
    expiresIn: `${ONE_HOUR_IN_MILLISECONDS}ms`, // expire dans 1h
  });

  return {
    token,
    expiresInMS: ONE_HOUR_IN_MILLISECONDS,
  };
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
