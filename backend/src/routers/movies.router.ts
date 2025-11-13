import { Router } from "express";
import * as moviesController from "../controllers/movies.controller.ts";


export const router = Router();

router.get("/movies", moviesController.getAllMovies);
router.get("/movies/:id", moviesController.getOneMovie);
