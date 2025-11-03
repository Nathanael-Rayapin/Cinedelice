import { Router } from "express";
import * as recipesController from "../controllers/recipes.controller.ts";

export const router = Router();

router.get("/recipes", recipesController.getAllRecipes);