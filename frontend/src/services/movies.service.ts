import axios from 'axios';
import type { IMovieDTO, ITmdbMovieDTO } from '../interfaces/movie';
import { showSnackbar } from '../utils/snackbar';

const BASE_URL = import.meta.env.VITE_BACKEND_API;
const TMDB_SEARCH_BASE_URL = import.meta.env.VITE_TMDB_SEARCH_BASE_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getMovies = async (): Promise<IMovieDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies`);

    if (response.status !== 200) {
      throw new Error('Erreur lors de la récupération des films');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

export const getOneMovie = async (movieId: number): Promise<IMovieDTO> => {
  try {
    const response = await axios.get(`${BASE_URL}/movies/${movieId}`);

    if (response.status !== 200) {
      throw new Error('Erreur lors de la récupération du film');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
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
