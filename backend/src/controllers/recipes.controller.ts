import { prisma } from "../models/index.ts";
import type { Request,Response } from "express";
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from "../lib/errors.ts";

// Lister toutes les recettes publiées
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
};

// Afficher une recette publiée
export async function getOneRecipe(req: Request, res: Response) {
  // on récupère l'ID de la recette qui nous intéresse dans l'URL :
  // Est-ce que l'utilisateur a envoyé un nombre valide dans l'URL ?
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) { throw new BadRequestError("Invalid ID format"); }

  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findUnique({ 
    where: {
      id: recipeId,
      status: "published", //Que les published
    },
    include: {
      user:{
        select:{username:true},
      },
      category:{
        select:{name:true},
      },
    }
  });
  if (!recipe) { throw new NotFoundError("Recipe not found"); }

  res.status(200).json(recipe);
};
// Afficher uniquement toutes mes recettes (publié et brouillon)
export async function getAllMyRecipes(req: Request, res: Response) {
  const user_id = req.currentUserId;

  if(!user_id){
    throw new UnauthorizedError("Vous devez être connecté pour voir vos recettes");
  }
  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findMany({ 
    where: {user_id},
  
    include: {
      user:{
        select:{username:true},
      },
      category:{
        select:{name:true},
      },
    }
  });
  if (!recipe) { throw new NotFoundError("Aucune recette trouvée"); }

  res.status(200).json(recipe);
};
// Afficher le détail de ma recette
export async function getMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = parseInt(req.params.id, 10);

  if (isNaN(recipeId)) { 
    throw new BadRequestError(" ID Invalide"); }
  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté pour créer une recette");
  }


  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findUnique({ 
    where: {
      id: recipeId,
      user_id: user_id,
    },
    include: {
      user:{
        select:{username:true},
      },
      category:{
        select:{name:true},
      },
    }
  });
  if (!recipe) { throw new NotFoundError("Aucune recette trouvé"); }

  res.status(200).json(recipe);
};

// Créer une recette
export async function createRecipe(req: Request, res: Response) {
  const { title, category_id, movie_id, number_of_person, preparation_time, description, image, ingredients, preparation_steps, status } = req.body;
  
  // Récupérer l'ID de l'utilisateur connecté depuis le token JWT
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté pour créer une recette");
  }

  // Vérifier qu'une recette avec le même titre n'existe pas déjà pour cet utilisateur
  const existingRecipe = await prisma.recipe.findFirst({
    where: {
      user_id: user_id,
      title: title
    }
  });

  if (existingRecipe) {
    throw new ConflictError("You already have a recipe with this title");
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
      status: status || 'draft'
    }
  });
  res.status(201).json(createdRecipe);
}

export async function updateRecipe(req: Request, res: Response) {
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) { throw new BadRequestError("Invalid ID format"); }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }});
  if (!recipe) { throw new NotFoundError("Recipe not found"); }

  // Utilise prisma pour modifier la recette et sa data
  const { title, category_id, movie_id, number_of_person, preparation_time, description, image, ingredients, preparation_steps, status } = req.body;
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
      status: status || 'draft'
    }
  });

  // Renvoyer la recette mise à jour
  res.status(200).json(updatedRecipe);
}

export async function deleteRecipe(req: Request, res: Response) {
  const recipeId = parseInt(req.params.id, 10);
  if (isNaN(recipeId)) { throw new BadRequestError("Invalid ID format"); }

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId }});
  if (!recipe) { throw new NotFoundError("Category not found"); }

  await prisma.recipe.delete({
    where: { id: recipeId }
  });

  res.status(204).end();
}