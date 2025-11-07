import axios from 'axios';
import type { IMovieProps } from '../interfaces/movie';

const BASE_URL = import.meta.env.VITE_BACKEND_API

export const getMovies: () => Promise<IMovieProps[]> = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/movies`);

        if (response.status !== 200) {
            throw new Error('Oups ! Une erreur est survenue lors de la récupération des films');
        }
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}