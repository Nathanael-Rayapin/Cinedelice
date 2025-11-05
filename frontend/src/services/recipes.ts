import axios from 'axios';
import type { IRecipe } from '../interfaces/recipe';

const BASE_URL = import.meta.env.VITE_BACKEND_API

export const getRecipes: () => Promise<IRecipe[]> = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/recipes`);

        if (response.status !== 200) {
            throw new Error('Oups ! Une erreur est survenue lors de la récupération des recettes');
        }
        
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}