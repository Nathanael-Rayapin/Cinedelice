// import * as z from "zod";
import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { ConflictError, NotFoundError } from "../lib/errors.ts";

export async function getAllCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
}

export async function getOneCategory(req: Request, res: Response) {
  // on récupère l'ID du categorie qui nous intéresse en BDD
  const categoryId = parseInt(req.params.id, 10);

  // On récupère la catégorie en BDD, si elle n'existe pas => 404
  const category = await prisma.category.findUnique({ where: {id: categoryId }});
  if (!category) { throw new NotFoundError("Category not found"); }

  res.status(200).json(category);
}

export async function createCategory(req: Request, res: Response) {
  const { name } = req.body;

  // Vérifier que la nouvelle catégorie n'existe pas déjà dans la BDD
  const nbOfCategoryWithSameName = await prisma.category.count({ where: { name } });
  if (nbOfCategoryWithSameName > 0) { throw new ConflictError("Category name is already taken"); }

  // L'insérer en BDD
  const createdCategory = await prisma.category.create({ data: { name } });

  res.status(201).json(createdCategory);
}