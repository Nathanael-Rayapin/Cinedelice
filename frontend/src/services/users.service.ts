import axios from "axios";
import type { IUserDTO } from "../interfaces/user";
import { showSnackbar } from "../utils/snackbar";
import type { Role } from "../interfaces/auth";

const BASE_URL = import.meta.env.VITE_BACKEND_API;


export const getUsers = async (): Promise<IUserDTO[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la récupération des utilisateurs');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

export const updateUserRole = async (userId: number, role: Role): Promise<IUserDTO> => {
  try {
    const response = await axios.patch(
      `${BASE_URL}/users/${userId}`,
      { role },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status !== 200) {
      throw new Error('Une erreur est survenue lors de la modification du rôle de l\'utilisateur');
    }

    return response.data;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};

export const deleteUser = async (userId: number): Promise<void> => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status !== 204) {
      throw new Error('Une erreur est survenue lors de la suppression de l\'utilisateur');
    }

    return;
  } catch (error) {
    showSnackbar("Oups ! Une erreur s'est produite. Veuillez réessayer plus tard.", false);
    throw error;
  }
};