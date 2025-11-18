import { Router } from "express";
import * as recipesController from "../controllers/recipes.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";
import { uploadImage } from "../middlewares/upload.ts";

export const router = Router();

router.get("/recipes/me",checkRoles(["user", "admin"]), recipesController.getAllMyRecipes);
router.get("/recipes/me/:id",checkRoles(["user", "admin"]), recipesController.getMyRecipe);
router.patch("/recipes/me/:id", checkRoles(["user", "admin"]), uploadImage, recipesController.updateMyRecipe);
router.delete("/recipes/me/:id", checkRoles(["user", "admin"]), uploadImage, recipesController.deleteMyRecipe);

router.get("/recipes", recipesController.getAllRecipes);
router.get("/recipes/:id", recipesController.getOneRecipe);

router.delete("/recipes/:id", checkRoles(["admin"]), uploadImage, recipesController.deleteAnyRecipe);
// Ajout d'une recette avec upload d'image via multer middleware
router.post("/recipes", checkRoles(["user", "admin"]), uploadImage, recipesController.createRecipe);

router.patch("/recipes/:id", checkRoles(["admin"]), recipesController.updateAnyRecipe);
