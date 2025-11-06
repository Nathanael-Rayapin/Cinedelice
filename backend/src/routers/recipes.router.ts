import { Router } from "express";
import * as recipesController from "../controllers/recipes.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

router.get("/recipes", checkRoles(["user", "admin"]), recipesController.getAllRecipes);
router.get("/recipes/:id", checkRoles(["user", "admin"]), recipesController.getOneRecipe);
router.post("/recipes", checkRoles(["user", "admin"]), recipesController.createRecipe);
router.patch("/recipes/:id", checkRoles(["user", "admin"]), recipesController.updateRecipe);
router.delete("/recipes/:id", checkRoles(["user", "admin"]), recipesController.deleteRecipe);