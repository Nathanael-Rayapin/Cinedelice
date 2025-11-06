import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

router.get("/categories", checkRoles(["user", "admin"]), categoriesController.getAllCategories);
router.get("/categories/:id", checkRoles(["user", "admin"]), categoriesController.getOneCategory);
router.post("/admin/categories", checkRoles(["admin"]), categoriesController.createCategory);
router.patch("/admin/categories/:id", checkRoles(["admin"]), categoriesController.updateCategory);
router.delete("/admin/categories/:id", checkRoles(["admin"]), categoriesController.deleteCategory);