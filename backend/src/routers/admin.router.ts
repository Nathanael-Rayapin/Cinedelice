import { Router } from "express";
import * as adminController from "../controllers/admin.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

// Toutes les routes ici sont réservées aux admins

router.get("/admin/users",checkRoles(["admin"]),adminController.getAllUsers);
router.patch("/admin/users/:id",checkRoles(["admin"]), adminController.updateUserRole);
router.delete("/admin/users/:id",checkRoles(["admin"]), adminController.deleteUser);
