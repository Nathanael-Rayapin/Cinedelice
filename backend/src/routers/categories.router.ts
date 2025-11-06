import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

router.get("/categories", checkRoles(["user", "admin"]), categoriesController.getAllCategories);
router.get("/categories/:id", checkRoles(["user", "admin"]), categoriesController.getOneCategory);
router.post("/categories", checkRoles(["admin"]), categoriesController.createCategory);
router.patch("/categories/:id", checkRoles(["admin"]), categoriesController.updateCategory);
router.delete("/categories/:id", checkRoles(["admin"]), categoriesController.deleteCategory);