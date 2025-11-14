import type { IMovieDTO } from '../interfaces/movie';
import { movies } from '../pages/Home/data';

export const getMovies = async (): Promise<IMovieDTO[]> => {
  // on simule un appel API (comme pour Recipes)
  await new Promise((res) => setTimeout(res, 500));
  return movies;
};
