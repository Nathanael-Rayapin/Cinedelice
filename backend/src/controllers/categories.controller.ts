// import * as z from "zod";
import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { BadRequestError, ConflictError, NotFoundError } from "../lib/errors.ts";

export async function getAllCategories(req: Request, res: Response) {
  const categories = await prisma.category.findMany();
  res.status(200).json(categories);
}

export async function getOneCategory(req: Request, res: Response) {
  // on récupère l'ID de la categorie qui nous intéresse en BDD
  const categoryId = parseInt(req.params.id, 10);
  if (isNaN(categoryId)) { throw new BadRequestError("Invalid ID format"); }

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

export async function updateCategory(req: Request, res: Response) {
  // ON récupère l'ID de la catégorie que l'on souhaite update en BDD
  const categoryId = parseInt(req.params.id, 10);
  if (isNaN(categoryId)) { throw new BadRequestError("Invalid ID format"); }

  const { name } = req.body;

  // On récupère la catégorie en BDD, s'il n'existe pas => 404
  const category = await prisma.category.findUnique({ where: { id: categoryId }});
  if (!category) { throw new NotFoundError("Category not found"); }

  // Vérifier si le nouveau nom cible pour la catégorie n'est pas déjà pris, sinon => 409
  const nbOfCategoryWithTheSameName = await prisma.category.count({ where: {
    name, // Y a-t-il des catégories avec le même nom...
    NOT: { id: categoryId } // ...qui ne sont pas la catégorie que l'on est en train d'update ?
  } });
  if (nbOfCategoryWithTheSameName > 0) { throw new ConflictError("Category name is already taken"); }

  // Utilise prisma pour modifier la catégorie avec son nouveau nom
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: { name }
  });

  // Renvoyer le niveau mis à jour
  res.status(200).json(updatedCategory);
}

export async function deleteCategory(req: Request, res: Response) {
  // on récupère l'ID de la categorie à supprimer en BDD
  const categoryId = parseInt(req.params.id, 10);
  if (isNaN(categoryId)) { throw new BadRequestError("Invalid ID format"); }

  // on récupère la catégorie en BDD, si elle n'existe pas => 404
  const category = await prisma.category.findUnique({ where: { id: categoryId }});
  if (!category) { throw new NotFoundError("Category not found"); }

  // on supprime la categorie avec Prisma
  await prisma.category.delete({
    where: { id: categoryId }
  });

  res.status(204).end();
}