// import * as z from "zod";
import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { NotFoundError } from "../lib/errors.ts";

export async function getAllCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany();
  res.json(categories);
}

export async function getOneCategory(req: Request, res: Response) {
  // on récupère l'ID du categorie qui nous intéresse en BDD
  const categoryId = parseInt(req.params.id, 10);
  
  // On récupère la catégorie en BDD, si elle n'existe pas => 404
  const category = await prisma.category.findUnique({ where: {id: categoryId }});
  if (!category) { throw new NotFoundError("Category not found"); }

  res.json(category);
}