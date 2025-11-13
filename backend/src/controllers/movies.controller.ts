import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import { NotFoundError } from "../lib/errors.ts";
import { parseIdFromParams } from "../validations/index.ts";

// Lister tous les films
export async function getAllMovies(req: Request, res: Response) {  
  const movies = await prisma.movie.findMany();
  res.status(200).json(movies);
}

// Récupérer un seul film
export async function getOneMovie(req: Request, res: Response) {
// on récupère l'ID de la categorie qui nous intéresse dans l'URL :
// Est-ce que l'utilisateur a envoyé un nombre valide dans l'URL ? :
// => Zod pour convertir string ID en number et valider
  const movieId = await parseIdFromParams(req.params.id);
    
  // Est-ce que cette catégorie existe vraiment dans la base de données ?
  // On récupère l'objet complet de la catégorie dans la BDD, si elle n'existe pas => 404
  const movie = await prisma.movie.findUnique({ where: { id: movieId }});
  if (!movie) { throw new NotFoundError("Movie not found"); }
    
  res.status(200).json(movie);
}


