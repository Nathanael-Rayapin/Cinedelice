import { Router } from "express";
import * as usersController from "../controllers/users.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();
//Lister les utilisateurs (admin)
router.get("/users",checkRoles(["admin"]),usersController.getAllUsers);
//Modifier le role d'un utilisateur (admin)
router.patch("/users/:id",checkRoles(["admin"]),usersController.updateUserRole);

//Supprimer un utilisateur (admin)
router.delete("/users/:id",checkRoles(["admin"]),usersController.deleteUser);
