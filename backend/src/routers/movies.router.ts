import { Router } from "express";
import * as moviesController from "../controllers/movies.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

router.post("/movies/search", checkRoles(["user", "admin"]), moviesController.addMovieFromTmdb);
router.get("/movies", checkRoles(["user", "admin"]), moviesController.getAllMovies);
router.get("/movies/:id", checkRoles(["user", "admin"]), moviesController.getOneMovie);