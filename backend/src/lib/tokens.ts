import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../../config.ts";
import { prisma, type Role, type User } from "../models/index.ts";
import { UnauthorizedError } from "./errors.ts";
import type { Response } from "express";

const ONE_HOUR_IN_MILLISECONDS = 1 * 60 * 60 * 1000;
const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export function generateAuthenticationTokens(user: User) {
  // Access token (JWT)
  const payload = { userId: user.id, role: user.role };
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: `${ONE_HOUR_IN_MILLISECONDS}ms` });

  // Refresh token (Opaque)
  const refreshToken = crypto.randomBytes(64).toString("base64");

  // Renvoyer les tokens
  return {
    accessToken: {
      token: accessToken,
      expiresInMS: ONE_HOUR_IN_MILLISECONDS
    },
    refreshToken: {
      token: refreshToken,
      expiresInMS: ONE_WEEK_IN_MILLISECONDS
    }
  };
}

export function verifyAndDecodeJWT(accessToken: string): AuthPayload {
  try {

    const jwtPayload = jwt.verify(accessToken, config.jwtSecret) as AuthPayload; // Caster le type pour se faciliter la vie
    return jwtPayload;

  } catch (error) {
    // si le token n'est pas valide ou expiré, renvoyer une 401
    console.error(error);
    throw new UnauthorizedError("Invalid or expired token");
  }
}

// Bonus : pour s'assurer des types de ce que contient le payload que l'on manipule
export interface AuthPayload extends JwtPayload {
  userId: number;
  userRole: Role;
}

export async function saveRefreshToken(user: User, refreshToken: Token) {
  await prisma.refreshToken.create({ data: {
    token: refreshToken.token,
    user_id: user.id,
    issued_at: new Date(),                                                 // Maintenant 
    expires_at: new Date(new Date().valueOf() + refreshToken.expiresInMS), // Maintenant + 7J
  }});
}

export interface Token {
  token: string;
  expiresInMS: number;
}

export function setTokensInCookies(res: Response, accessToken: Token, refreshToken: Token) {
  res.cookie("accessToken", accessToken.token, {
    httpOnly: true, // Le cookie ne sera pas lisible via "document.cookie" côté frontend par sécurité // ==> éviter les XSS
    maxAge: accessToken.expiresInMS, // 1h de validité du cookie

    // Pour des cookies sécurisés cross-origin il faut :
    secure: true,     // les cookies cross-origin, c'est seulement en HTTPS !
    sameSite: "none"  // les cookies cross-origin, c'est forcement entre plusieurs origins
  });

  res.cookie("refreshToken", refreshToken.token, {
    path: "/api/auth/refresh", // Afin que le cookie ne soit transmis du front->back uniquement sur la route /api/auth/refresh
    httpOnly: true, // Le cookie ne sera pas lisible via "document.cookie" côté frontend par sécurité // ==> éviter les XSS
    maxAge: refreshToken.expiresInMS, // 7j de validité du cookie
    secure: true,
    sameSite: "none",
  });
}