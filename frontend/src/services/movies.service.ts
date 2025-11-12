import { movies } from "../pages/Home/data"; 
import type { IMovieProps } from "../interfaces/movie";

export const getMovies = async (): Promise<IMovieProps[]> => {
  // on simule un appel API (comme pour Recipes)
  await new Promise(res => setTimeout(res, 500));
  return movies;
};
