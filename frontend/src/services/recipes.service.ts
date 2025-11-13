import axios from 'axios';
import type { IRecipeDTO } from '../interfaces/recipe';
import { showSnackbar } from '../utils/snackbar';

const BASE_URL = import.meta.env.VITE_BACKEND_API

export const getRecipes = async (): Promise<IRecipeDTO[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/recipes`);

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la récupération des recettes');
        }
                
        return response.data;
    } catch (error) {
        console.error(error);
        showSnackbar('Oups ! Une erreur s\'est produite. Veuillez réessayer plus tard.', false);
        throw error;
    }
}

export const getOneRecipe = async (recipeId: number): Promise<IRecipeDTO> => {
    try {
        const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`);

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la récupération de la recette');
        }
        
        return response.data;
    } catch (error) {
        console.error(error);
        showSnackbar('Oups ! Une erreur s\'est produite. Veuillez réessayer plus tard.', false);
        throw error;
    }
}