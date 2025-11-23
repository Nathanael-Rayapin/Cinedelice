import axios from "axios";
import { showSnackbar } from "../utils/snackbar";

const BASE_URL = import.meta.env.VITE_BACKEND_API;

export const addLike = async (recipeId: number): Promise<{ totalLikes: number }> => {
  try {
    const response = await axios.post(`${BASE_URL}/favourites/${recipeId}`);

    if (response.status !== 201) {
      throw new Error('Une erreur est survenue lors de l\'ajout d\'un like');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

export const removeLike = async (recipeId: number): Promise<{ totalLikes: number }> => {
  try {
    const response = await axios.delete(`${BASE_URL}/favourites/${recipeId}`);

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la suppression d\'un like');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};