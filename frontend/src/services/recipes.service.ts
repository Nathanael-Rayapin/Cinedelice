import axios from 'axios';
import type { ICreateRecipeDTO, IRecipeDTO } from '../interfaces/recipe';
import { showSnackbar } from '../utils/snackbar';

const BASE_URL = import.meta.env.VITE_BACKEND_API;


// Récupérer toutes les recettes
export const getRecipes = async (params?: { search?: string; categorie?: string }): Promise<IRecipeDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes`, { params });

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération des recettes');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

// Récupérer une recette par son ID
export const getOneRecipe = async (recipeId: number): Promise<IRecipeDTO> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/${recipeId}`);

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération de la recette');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

// Récupérer les recettes de l'utilisateur connecté
export const getMyRecipes = async (): Promise<IRecipeDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération des recettes');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

// Récupérer une recette de l'utilisateur connecté par son ID
export const getMyRecipe = async (recipeId: number): Promise<IRecipeDTO> => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/me/${recipeId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération de la recette');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

// Créer une nouvelle recette
export const createRecipe = async (formData: FormData): Promise<ICreateRecipeDTO> => {
  try {
    const response = await axios.post(`${BASE_URL}/recipes`,
      {
        formData
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la création de la recette');
    }

    showSnackbar("La recette a bien été créée", true);
    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};
