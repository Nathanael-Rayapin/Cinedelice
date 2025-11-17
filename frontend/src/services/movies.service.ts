import axios from 'axios';
import type { IMovieDTO } from '../interfaces/movie';
const BASE_URL = import.meta.env.VITE_BACKEND_API;
import type { IMovieDTO, ITmdbMovieDTO } from '../interfaces/movie';
import { movies } from '../pages/Home/data';
import { showSnackbar } from '../utils/snackbar';

const TMDB_SEARCH_BASE_URL = import.meta.env.VITE_TMDB_SEARCH_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getMovies = async (): Promise<IMovieDTO[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/movies`);
    if (res.status !== 200) throw new Error('Erreur lors de la récupération des films');
    return res.data;
  } catch (err) {
    // fallback: renvoyer tableau vide
    return [] as IMovieDTO[];
  }
};

export const getOneMovie = async (movieId: number): Promise<IMovieDTO> => {
  try {
    const res = await axios.get(`${BASE_URL}/movies/${movieId}`);
    if (res.status !== 200) throw new Error('Erreur lors de la récupération du film');
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const searchMovies = async (query: string): Promise<ITmdbMovieDTO[]> => {
  try {
    const response = await axios.get(`${TMDB_SEARCH_BASE_URL}`, {
      params: {
        api_key: TMDB_API_KEY,
        query: query,
        language: "fr-FR",
        include_adult: false,
        page: 1
      }
    }
    );

    return response.data.results
  } catch (error) {
    showSnackbar('Oups ! Une erreur est survenue, veuillez réessayer plus tard.', false);
    throw error;
  }
};
