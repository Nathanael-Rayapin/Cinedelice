import axios from 'axios';
import type { IMovieDTO } from '../interfaces/movie';
const BASE_URL = import.meta.env.VITE_BACKEND_API;

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
