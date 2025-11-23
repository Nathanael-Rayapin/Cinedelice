import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.ts";
import { verifyAndDecodeJWT } from "../lib/tokens.ts";
import type { Role } from "../models/index.ts";

export function checkRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // On récupère le token UNIQUEMENT depuis le header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError("Token manquant dans le header Authorization");
    }

    // Le header doit ressembler à : "Bearer eyJhbGciOi..."
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError("Format du token invalide (attendu: Bearer <token>)");
    }

    const token = parts[1];

    // Vérifie et décode le token JWT
    const { role, userId } = verifyAndDecodeJWT(token);

    // Vérifie si le rôle est autorisé à accéder à cette route
    if (!roles.includes(role)) {
      throw new ForbiddenError("Accès refusé : rôle insuffisant");
    }

    // Ajoute les infos utiles à la requête (pour les middlewares suivants)
    req.currentUserId = userId;

    req.currentUserRole = role;


    next(); // on laisse passer la requête
  };
}
