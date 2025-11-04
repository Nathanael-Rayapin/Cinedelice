import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../lib/errors.ts";
import type { Role } from "../models/index.ts";
import { verifyAndDecodeJWT } from "../lib/tokens.ts";

// Ce middleware :
// - laisse passer si l'utilisateur est soit membre, author ou admin
// - ne pas laisser passer sinon

// Si Prisma n'avait pas exporté le type Role, on aurait du le coder à la main de cette manière
// type Role = "member" | "author" | "admin";

export function checkRoles(roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const accessToken = extractAccessToken(req);
  
    // Valider et décoder l'`access token` (JWT) à l'aide de la librairie `jsonwebtoken`. 
    // Récupérer l'ID de l'utilisateur depuis le payload du JWT décodé
    const { role, userId } = verifyAndDecodeJWT(accessToken);

    // Si le rôle de l'utilisateur n'est pas inclu dans les rôles acceptés par la fonction, alors on rejette la réponse avec une 403 - Forbidden
    if (! roles.includes(role)) { throw new ForbiddenError("Access denied"); }

    // On accroche 'userId' et 'role' à `req` pour pouvoir s'en servir dans les middlewares suivants
    // Note : au niveau du typage TS, on a du etendre l'interface Request d'Express afin de rajouter ses propriétés (@types/express.d.ts)
    req.userId = userId;
    req.userRole = role;

    // On appelle le middleware suivant
    next();
  };
}


function extractAccessToken(req: Request): string {
  // On cherche l'access token dans les cookies
  if (typeof req.cookies?.accessToken === "string") {
    return req.cookies.accessToken;
  }

  // Sinon on cherche l'access token dans le header Authorization ("Bearer XXXX")
  if (typeof req.headers?.authorization?.split(" ")[1] === "string") {
    return req.headers.authorization.split(" ")[1];
  }

  // S'il n'y a pas d'accessToken,
  // alors, on throw une erreur Unauthrorized qui remonte à notre global-error-handler
  // qui s'occupe de renvoyer une 401
  throw new UnauthorizedError("Missing access token");
}