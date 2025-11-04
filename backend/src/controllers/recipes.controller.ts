// On importe notre client Prisma déjà configuré (connexion à la base de données)
import { prisma } from "../models/index.ts";
// On importe les types Request et Response pour mieux typer Express
import type { Request,Response } from "express";

export async function getAllRecipes(req:Request,res:Response){
  const recipes = await prisma.recipe.findMany({
    where:{
      NOT:{status:"draft"},//exclut brouillon
    },
    include:{
      //on remplace le user_id par les info de l user
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