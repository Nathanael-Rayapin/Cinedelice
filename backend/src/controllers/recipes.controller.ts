// import * as z from "zod";
import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { BadRequestError, NotFoundError } from "../lib/errors.ts";

export async function getAllRecipes(req:Request,res:Response){
  const recipes = await prisma.recipe.findMany({
    where:{
      NOT:{status:"draft"},//exclut brouillon
    },
    include:{
      //on rajoute le user_id par les info de l user
      user:{
        select:{username:true},//on ne garde que le nom
      },
      //on inclut les le nom de la categorie
      category:{
        select:{name:true},
      },
    },
  });
  res.status(200).json(recipes);
}

export async function getOneRecipe(req: Request, res: Response) {
  // On récupère l'ID de la recette en BDD
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) { throw new BadRequestError("Invalid ID format"); }

  // On récupère la recette en BDD
  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }});
  if (!recipe) { throw new NotFoundError("Recipe not found"); }

  res.status(200).json(recipe);
}