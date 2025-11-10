import { Router } from "express";
import * as recipesController from "../controllers/recipes.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

router.get("/recipes/me",checkRoles(["user", "admin"]), recipesController.getAllMyRecipes);
router.get("/recipes/me/:id",checkRoles(["user", "admin"]), recipesController.getMyRecipe);

router.get("/recipes", recipesController.getAllRecipes);
router.get("/recipes/:id", recipesController.getOneRecipe);

router.patch("/recipes/me/:id", checkRoles(["user", "admin"]), recipesController.updateMyRecipe);
//router.delete("/recipes/:id", checkRoles(["admin"]), recipesController.deleteRecipe);

router.post("/recipes", checkRoles(["user", "admin"]), recipesController.createRecipe);

router.patch("/recipes/:id", checkRoles(["admin"]), recipesController.updateAnyRecipe);
