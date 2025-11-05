import { Router } from "express";
import * as categoriesController from "../controllers/categories.controller.ts";

export const router = Router();

router.get("/categories", categoriesController.getAllCategories);
router.get("/categories/:id", categoriesController.getOneCategory);
router.post("/admin/categories", categoriesController.createCategory);
router.patch("/admin/categories/:id", categoriesController.updateCategory);