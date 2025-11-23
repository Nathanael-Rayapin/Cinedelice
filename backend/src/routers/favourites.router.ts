import { Router } from "express";
import * as favouritesController from "../controllers/favourites.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

// Récupérer tout les likes d'une recette (le frontend map une liste des recettes et apelle cette fonction pour chacunes d'elles)
router.get("/favourites",checkRoles(["user", "admin"]), favouritesController.getMyFavouritesRecipes);

// Ajouter un like à une recette
router.post("/favourites/:id",checkRoles(["user", "admin"]), favouritesController.addLikeToRecipe);

// Supprimer un like à une recette
router.delete("/favourites/:id",checkRoles(["user", "admin"]), favouritesController.removeLikeFromRecipe);