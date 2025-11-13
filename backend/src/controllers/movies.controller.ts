import type { Request, Response } from "express";
import { prisma } from "../models/index.ts";
import * as movieService from "../services/movie.service.ts";

export async function addMovieFromTmdb(req: Request, res: Response) {
  try {
    //On récupere le titre du film envoyé par le front (du input)
    const { title } = req.body;
    // on appel notre service pour chercher le film dans TMDB 
    const tmdbResults = await movieService.searchMovieInTmdb(title);
    // On recupere le premier film trouvé dans TMBD
    res.status(200).json(tmdbResults);
  } catch (error) {
    console.error("Error adding movie from TMDB:", error);
    res.status(500).json({ message: "Internal server error" });
  }}




//export async function getAllMovies(req: Request, res: Response) {    }

//export async function getOneMovie(req: Request, res: Response) {}

