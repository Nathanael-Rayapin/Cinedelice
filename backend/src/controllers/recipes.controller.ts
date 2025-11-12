import { prisma } from "../models/index.ts";
import type { Request, Response } from "express";
import { Prisma } from "@prisma/client";

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../lib/errors.ts";

// Lister toutes les recettes publiées
export async function getAllRecipes(req: Request, res: Response) {

  // Vérifie si la requête contient un paramètre "search" sous forme de texte
  // Si oui, on enlève les espaces au début et à la fin avec .trim()
  // Sinon, on met une chaîne vide ("") par défaut
  const rawSearch =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const rawCategorie =
    typeof req.query.categorie === "string" ? req.query.categorie.trim() : "";

  // On construit un filtre "where" avec les recettes publiées
  const where: Prisma.RecipeWhereInput = {
    status: "published", // seulement les recettes publiées
  };
  // Si l'utilisateur a tapé quelque chose dans la barre de recherche...
  // ...alors on ajoute une condition pour chercher dans le titre de la recette
  // "contains" signifie qu'on cherche un mot ou une partie du mot dans le titre
  // "mode: 'insensitive'" veut dire qu'on ne fait pas attention aux majuscules/minuscules
  if (rawSearch !== "") {
    where.OR = [
      {
        title:{
          contains: rawSearch,
          mode: "insensitive",// ignore majuscules/minuscules
        },
      },
      {
        movie:{
          is:{
            title:{ 
              contains: rawSearch,
              mode:"insensitive",
            },
          },
        },
      },
    ];
  }

  // recherche dans le titre du film
  //
  // Filtre par categorie
  if (rawCategorie !== "") {
    where.category = {
      name: { equals:rawCategorie, mode: "insensitive" },
    };
  }

  const recipes = await prisma.recipe.findMany({
    where,
    include: {
      user: {
        select: { username: true } }, //on ne garde que le nom
      category: {
        select: { name: true } },//on inclut les le nom de la categorie
      movie: { 
        select: { title: true } }, //on affiche aussi le titre du film
    },
  });
  res.status(200).json(recipes);
}

// Afficher une recette publiée
export async function getOneRecipe(req: Request, res: Response) {
  // on récupère l'ID de la recette qui nous intéresse dans l'URL :
  // Est-ce que l'utilisateur a envoyé un nombre valide dans l'URL ?
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) {
    throw new BadRequestError("ID Invalide");
  }

  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      status: "published", //Que les published
    },
    include: {
      user: {
        select: { username: true },
      },
      category: {
        select: { name: true },
      },
      movie:{
        select: { title: true },
      },
    },
  },
  );
  if (!recipe) {
    throw new NotFoundError("Aucune recette trouvée");
  }

  res.status(200).json(recipe);
}

// Afficher uniquement toutes mes recettes (publié et brouillon)
export async function getAllMyRecipes(req: Request, res: Response) {
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour voir vos recettes"
    );
  }
  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findMany({
    where: { user_id },

    include: {
      user: {
        select: { username: true },
      },
      category: {
        select: { name: true },
      },
      movie:{
        select: { title: true },
      },
    },
  });
  if (recipe.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(recipe);
}
// Afficher le détail de ma recette
export async function getMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = parseInt(req.params.id, 10);

  if (isNaN(recipeId)) {
    throw new BadRequestError(" ID Invalide");
  }
  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }

  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findUnique({
    where: {
      id: recipeId,
      user_id: user_id,
    },
    include: {
      user: {
        select: { username: true },
      },
      category: {
        select: { name: true },
      },
      movie:{
        select: { title: true },
      },
    },
  });
  if (!recipe) {
    throw new NotFoundError("Aucune recette trouvé");
  }

  res.status(200).json(recipe);
}

// Créer une recette
export async function createRecipe(req: Request, res: Response) {
  const {
    title,
    category_id,
    movie_id,
    number_of_person,
    preparation_time,
    description,
    image,
    ingredients,
    preparation_steps,
    status,
  } = req.body;

  // Récupérer l'ID de l'utilisateur connecté depuis le token JWT
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }

  // Vérifier qu'une recette avec le même titre n'existe pas déjà pour cet utilisateur
  const existingRecipe = await prisma.recipe.findFirst({
    where: {
      user_id: user_id,
      title: title,
    },
  });

  if (existingRecipe) {
    throw new ConflictError("Vous avez déjà une recette avec ce titre");
  }

  // Créer la recette
  const createdRecipe = await prisma.recipe.create({
    data: {
      user_id,
      category_id,
      movie_id,
      title,
      number_of_person,
      preparation_time,
      description,
      image,
      ingredients,
      preparation_steps,
      status: status || "draft",
    },
  });
  res.status(201).json(createdRecipe);
}

// Modifier n'importe quel recette (admin)
export async function updateAnyRecipe(req: Request, res: Response) {
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) {
    throw new BadRequestError(" ID Invalide");
  }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) {
    throw new NotFoundError("Recette introuvable");
  }

  // Utilise prisma pour modifier la recette et sa data
  const {
    title,
    category_id,
    movie_id,
    number_of_person,
    preparation_time,
    description,
    image,
    ingredients,
    preparation_steps,
    status,
  } = req.body;
  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      category_id,
      movie_id,
      title,
      number_of_person,
      preparation_time,
      description,
      image,
      ingredients,
      preparation_steps,
      status,
    },
  });

  // Renvoyer la recette mise à jour
  res.status(200).json({
    message: `La recette "${updatedRecipe.title}" a été mise à jour avec succès par l'administrateur`,
    recipe: updatedRecipe,
  });
}

// Modifier ma recette (admin et user)
export async function updateMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = parseInt(req.params.id, 10);

  if (isNaN(recipeId)) {
    throw new BadRequestError(" ID Invalide");
  }
  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }

  const recipe = await prisma.recipe.findFirst({
    //SELECT *FROM recipe WHERE id = <valeur_de_recipeId> AND user_id = <valeur_de_user_id> LIMIT 1;
    where: { id: recipeId, user_id },
  });
  if (!recipe) {
    throw new NotFoundError("Recette introuvable.");
  }

  // Utilise prisma pour modifier la recette et sa data
  const {
    title,
    category_id,
    movie_id,
    number_of_person,
    preparation_time,
    description,
    image,
    ingredients,
    preparation_steps,
    status,
  } = req.body;
  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      category_id,
      movie_id,
      title,
      number_of_person,
      preparation_time,
      description,
      image,
      ingredients,
      preparation_steps,
      status,
    },
  });

  // Renvoyer la recette mise à jour
  res.status(200).json({
    message: `La recette "${updatedRecipe.title}" a été mise à jour avec succès`,
    recipe: updatedRecipe,
  });
}

// Supprimer n'importe quelle recette (admin)
export async function deleteAnyRecipe(req: Request, res: Response) {
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) {
    throw new BadRequestError("ID invalide");
  }

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      NOT: { status: "draft" }, //exclure brouillon
    },
  });
  if (!recipe) {
    throw new NotFoundError(
      "Recette introuvable ou vous n'avez pas les droits sur cette recettes."
    );
  }

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  res.status(204).end();
}

// Supprimer ma recette (admin et user)
export async function deleteMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = parseInt(req.params.id, 10);

  if (isNaN(recipeId)) {
    throw new BadRequestError("ID invalide");
  }
  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }

  const recipe = await prisma.recipe.findFirst({
    where: { id: recipeId, user_id },
  });
  if (!recipe) {
    throw new NotFoundError(
      "Recette introuvable ou vous n'avez pas les droits sur cette recettes."
    );
  }

  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  res.status(204).end();
}
