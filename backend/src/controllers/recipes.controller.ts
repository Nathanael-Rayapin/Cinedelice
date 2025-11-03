// On importe notre client Prisma déjà configuré (connexion à la base de données)
import { prisma } from "../models/index.ts";
// On importe les types Request et Response pour mieux typer Express
import type { Request,Response } from "express";

export async function getAllRecipes(req:Request,res:Response){
  const recipes = await prisma.recipe.findMany();
  res.status(200).json(recipes);
}