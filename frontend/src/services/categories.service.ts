import axios from "axios";
import type { ICategoryDTO } from "../interfaces/category";
import { showSnackbar } from "../utils/snackbar";

const BASE_URL = import.meta.env.VITE_BACKEND_API;

// Récupérer toutes les catégories
export const getCategories = async (): Promise<ICategoryDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/categories`);

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération des catégories');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};