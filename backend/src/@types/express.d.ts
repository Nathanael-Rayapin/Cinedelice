import "express";
import type { Role } from "../../models/index.ts";

// On "étend" l'interface Request existante d'Express
declare module "express-serve-static-core" {
  interface Request {
    currentUserId?: number;
    currentUserRole?: Role;

  }
}
