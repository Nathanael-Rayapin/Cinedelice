import { prisma } from "../models/index.ts";
import type { Request,Response } from "express";

export async function getAllRecipes(req:Request,res:Response){
  const recipes = await prisma.recipe.findMany();
  res.json(recipes);
}