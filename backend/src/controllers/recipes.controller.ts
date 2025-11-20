import { prisma } from "../models/index.ts";
import { Prisma } from "@prisma/client";
import { recipeUpdateLocks } from "../lib/lock.ts";
import type { Request,Response } from "express";
import { BadRequestError, ConflictError, InternalServerError, NotFoundError, UnauthorizedError } from "../lib/errors.ts";
import { parseIdFromParams,validateDraftRecipe, validateCreateRecipe, validateUpdateRecipe } from "../validations/index.ts";
import { findOrCreateMovieFromId } from "../services/movie.service.ts";
import { deleteImageFromCloudinary, uploadImageToCloudinary } from "../services/upload.service.ts";


// Lister toutes les recettes publiées
export async function getAllRecipes(req: Request, res: Response) {

  // Vérifie si la requête contient un paramètre "search" sous forme de texte
  // Si oui, on enlève les espaces au début et à la fin avec .trim()
  // Sinon, on met une chaîne vide ("") par défaut
  const rawSearch =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const rawCategorie =
    typeof req.query.categorie === "string" ? req.query.categorie.trim() : "";

  // Filtre de base : uniquement les recettes publiées
  const where: Prisma.RecipeWhereInput = {
    status: "published", // seulement les recettes publiées
  };
  // Si l'utilisateur a tapé quelque chose dans la barre de recherche...
  // ...alors on ajoute une condition pour chercher dans le titre de la recette
  // "contains" signifie qu'on cherche un mot ou une partie du mot dans le titre
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

// Afficher une recette publiée par son ID
export async function getOneRecipe(req: Request, res: Response) {
  // on récupère l'ID de la recette qui nous intéresse dans l'URL :
  // => Zod pour convertir string ID en number et valider
  const recipeId = await parseIdFromParams(req.params.id);

  // Est-ce que cette recette existe vraiment dans la base de données ?
  // On récupère l'objet complet de la recette dans la BDD, si elle n'existe pas => 404
  const recipe = await prisma.recipe.findUnique({
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
      movie:true ,
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
      movie:true,
    },
  },
  );
  // Si aucune recette, on renvoie simplement un tableau vide
  if (recipe.length === 0) {
    return res.status(200).json([]);
  }

  res.status(200).json(recipe);
}

// Afficher le détail de ma recette (publié et brouillon)
export async function getMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = await parseIdFromParams(req.params.id);

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
      movie:true,
    },
  },
  );
  if (!recipe) {
    throw new NotFoundError("Aucune recette trouvé");
  }

  res.status(200).json(recipe);
}

// Créer une recette avec un film associé
//le front envoie un movie_id du film TMDb
// Le back va chercher/creer le film dans notre BDD
export async function createRecipe(req: Request, res: Response) {
  // Récupérer l'ID de l'utilisateur connecté
  const user_id = req.currentUserId;

  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté pour créer une recette");
  }
  // L'image envoyée par le front via middleware Multer
  const file = req.file;

  //si aucune image n'est fournie, on renvoie une erreur
  if (!file) {
    throw new BadRequestError("Aucun fichier fourni");
  }

  // On vérifie les données JSON envoyées dans le body
  const { 
    title, 
    category_id, 
    movie_id, 
    number_of_person, 
    preparation_time, 
    description, 
    ingredients, 
    preparation_steps, 
    status 
  } = await validateCreateRecipe(req.body);


  // Vérifier que l'utilisateur n'a pas déjà une recette avec ce titre
  const existingRecipe = await prisma.recipe.findFirst({
    where: {
      user_id: user_id,
      title: title,
    },
  });

  if (existingRecipe) {
    throw new ConflictError("Vous avez déjà une recette avec ce titre");
  }

  // Récupérer/créer le film dans NOTRE BDD à partir de l'ID TMDb
  const movie = await findOrCreateMovieFromId(movie_id);
  // Uploader l'image sur Cloudinary
  const imageUrl = await uploadImageToCloudinary(file.buffer); // c'est une string
  if (!imageUrl) {
    throw new InternalServerError("Erreur lors de l'upload de l'image");
  }
  // Créer la recette avec le film associé
  const createdRecipe = await prisma.recipe.create({
    data: {
      user_id,
      category_id,
      movie_id:movie.id, // on relie la recette au film trouvé/créé dans notre bbd
      title,
      number_of_person,
      preparation_time,
      description,
      image: imageUrl,// URL de l'image uploadée sur Cloudinary
      ingredients,
      preparation_steps,
      status: status || "draft",
    },
  });
  res.status(201).json(createdRecipe);
}

// Créer une recette draft (brouillon)
export async function createDraftRecipe(req: Request, res: Response) {
  // Récupérer l'ID de l'utilisateur connecté
  const user_id = req.currentUserId;
  if (!user_id) {
    throw new UnauthorizedError("Vous devez être connecté pour créer une recette");
  }
  // validation du body tous champs optionnels sauf title
  const fields = await validateDraftRecipe(req.body);
  // image est optionnelle pour un brouillon
  let imageUrl = null;
  if (req.file) {
    const uploadedImage = await uploadImageToCloudinary(req.file.buffer);
    if (!uploadedImage) {
      throw new InternalServerError("Erreur lors de l'upload de l'image");
    }
    imageUrl = uploadedImage;
  }
  if (!imageUrl) {
    imageUrl = "https://placehold.co/400x250?text=Brouillon"; // Image par défaut pour les brouillons sans image
  }
  //si aucune image envoyé


 
  let finalMovieId = null;
  // si un movie_id est fourni, on cherche/crée le film
  if(fields.movie_id){
    const movie = await findOrCreateMovieFromId(fields.movie_id);
    finalMovieId = movie.id;
  } else {
    finalMovieId = 1; // ID du film "Inconnu" par défaut
  }
  // Créer le brouillon dans la BDD
  const draftRecipe = await prisma.recipe.create({
    data: {
      user_id,
      category_id: fields.category_id || 4, // catégorie "Autres" par défaut si non fournie
      movie_id: finalMovieId,
      title: fields.title,
      number_of_person: fields.number_of_person || 1,
      preparation_time: fields.preparation_time || 10,
      description: fields.description || "",
      image: imageUrl,
      ingredients: fields.ingredients || "Ingrédient 1\nIngrédient 2",
      preparation_steps: fields.preparation_steps || "Étape 1\nÉtape 2",
      status: fields.status || "draft",
    },
  });
  res.status(201).json(draftRecipe);
}

// Modifier la categorie de n'importe quel recette (admin)
export async function updateAnyRecipe(req: Request, res: Response) {
  const recipeId = await parseIdFromParams(req.params.id);

  const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
  if (!recipe) {
    throw new NotFoundError("Recette introuvable");
  }

  // Utilise prisma pour modifier la recette et sa data
  const { category_id } = await validateUpdateRecipe(req.body);

  // On met uniquement la catégorie à jour
  const updatedRecipe = await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      category_id,
    },
  });
  // Renvoyer la recette mise à jour
  res.status(200).json({
    message: `La recette "${updatedRecipe.title}" a été mise à jour avec succès par l'administrateur`,
    recipe: updatedRecipe,
  });
}

// Modifier ma recette 
export async function updateMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  
  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }
  //Récupérer l'ID de la recette depuis l'URL
  const recipeId = await parseIdFromParams(req.params.id);

  const recipe = await prisma.recipe.findUnique({
    //SELECT *FROM recipe WHERE id = <valeur_de_recipeId> AND user_id = <valeur_de_user_id> LIMIT 1;
    where: { id: recipeId, user_id },
  });
  if (!recipe) {
    throw new NotFoundError("Recette introuvable.");
  }

  if (recipeUpdateLocks.has(recipeId)) {
    throw new ConflictError("Une mise à jour de cette recette est déjà en cours. Veuillez réessayer plus tard.");
  }
  recipeUpdateLocks.add(recipeId);
  try {
  // Utilise prisma pour modifier la recette et sa data
    const { title, category_id, movie_id, number_of_person, preparation_time, description, ingredients, preparation_steps, status } = await validateUpdateRecipe(req.body);
  
    let finalMovieId = recipe.movie_id; // par défaut on garde l'ancien film

    // si le titre du film a changé, on cherche/crée le nouveau film
    if(movie_id){
      const movie = await findOrCreateMovieFromId(movie_id);
      finalMovieId = movie.id;
    }

    let finalImageUrl = recipe.image; // par défaut on garde l'ancienne image
    // Si une nouvelle image envoyée > on supprime l'ancienne sur Cloudinary,
    if (req.file) {
      //   puis on upload la nouvelle, et on récupère l'URL Cloudinary.
      const newImageUrl = await uploadImageToCloudinary(req.file.buffer);
      if (!newImageUrl) {
        throw new InternalServerError("Erreur lors de l'upload de l'image");
      }
      try{
        await deleteImageFromCloudinary(recipe.image);
      } catch {
        throw new InternalServerError("Erreur lors de la suppression de l'ancienne image sur Cloudinary");
      }
      finalImageUrl = newImageUrl;
    }
    // On met à jour la recette avec les nouvelles données 
    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        category_id,
        movie_id:finalMovieId,
        title,
        number_of_person,
        preparation_time,
        description,
        ingredients,
        preparation_steps,
        status,
        image: finalImageUrl, // Url c'est l'ancien ou nouvelle image
      },
    });

    // Renvoyer la recette mise à jour
    res.status(200).json({
      message: `La recette "${updatedRecipe.title}" a été mise à jour avec succès`,
      recipe: updatedRecipe,
    });

  } finally {
    recipeUpdateLocks.delete(recipeId);
  }
}

// Supprimer n'importe quelle recette (admin)
export async function deleteAnyRecipe(req: Request, res: Response) {
  const recipeId = await parseIdFromParams(req.params.id);

  const recipe = await prisma.recipe.findUnique({ 
    where: { id: recipeId,
      NOT:{status:"draft"}, //exclure brouillon
    }
  });
  if (!recipe) {
    throw new NotFoundError(
      "Recette introuvable ou vous n'avez pas les droits sur cette recettes."
    );
  }
  // Supprimer l'image de Cloudinary associée à la recette
  try{
    await deleteImageFromCloudinary(recipe.image);
  } catch {
    throw new InternalServerError("Erreur lors de la suppression de l'image sur Cloudinary");
  }
  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  res.status(204).end();
}

// Supprimer ma recette (admin et user)
export async function deleteMyRecipe(req: Request, res: Response) {
  const user_id = req.currentUserId;
  const recipeId = await parseIdFromParams(req.params.id);

  if (!user_id) {
    throw new UnauthorizedError(
      "Vous devez être connecté pour créer une recette"
    );
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId, user_id },
  });
  if (!recipe) {
    throw new NotFoundError(
      "Recette introuvable ou vous n'avez pas les droits sur cette recettes."
    );
  }
  // Supprimer l'image de Cloudinary associée à la recette
  try{
    await deleteImageFromCloudinary(recipe.image);
  } catch {
    throw new InternalServerError("Erreur lors de la suppression de l'image sur Cloudinary");
  }
  await prisma.recipe.delete({
    where: { id: recipeId },
  });

  res.status(204).end();
}