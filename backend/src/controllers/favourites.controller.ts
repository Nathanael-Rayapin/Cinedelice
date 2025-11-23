import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { ConflictError, NotFoundError, UnauthorizedError } from "../lib/errors.ts";
import { parseIdFromParams } from "../validations/index.ts";

export async function getMyFavouritesRecipes(req: Request, res: Response) {
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté");
  }

  const favourites = await prisma.favourite.findMany({
    where: { user_id },
    include: {
      recipe: true
    },
  });

  res.status(20).json({
    favourites,
  });
}

export async function addLikeToRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté");
  }

  const recipeId = await parseIdFromParams(req.params.id);

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) {
    throw new NotFoundError("Aucune recette trouvée");
  }

  try {
    await prisma.favourite.create({
      data: {
        user_id,
        recipe_id: recipeId,
      },
    });

    // Retourne le nombre de likes après ajout
    const totalLikes = await prisma.favourite.count({
      where: { recipe_id: recipeId },
    });

    res.status(201).json({
      totalLikes,
    });
  } catch (error: any) {
    // Code P2002 https://www.prisma.io/docs/orm/reference/error-reference#p2002
    if (error.code === "P2002") {
      throw new ConflictError("Vous avez déjà liké cette recette");
    }
    throw error;
  }
}

export async function removeLikeFromRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté");
  }

  const recipeId = await parseIdFromParams(req.params.id);
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });

  if (!recipe) {
    throw new NotFoundError("Aucune recette trouvée");
  }

  try {
    await prisma.favourite.delete({
      where: {
        user_id_recipe_id: {
          user_id,
          recipe_id: recipeId,
        },
      },
    });

    // Retourne le nombre de likes après suppression
    const totalLikes = await prisma.favourite.count({
      where: { recipe_id: recipeId },
    });

    res.status(200).json({
      totalLikes,
    });
  } catch (error: any) {
    // Code P2025 https://www.prisma.io/docs/orm/reference/error-reference#p2025
    if (error.code === "P2025") {
      res.status(404).json({ message: "Vous n'aviez pas liké cette recette" });
      return;
    }
    throw error;
  }
}