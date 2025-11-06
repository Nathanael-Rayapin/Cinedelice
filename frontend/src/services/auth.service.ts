import axios from 'axios';
import type { IAuth, IAuthDTO } from '../interfaces/auth';
import { showSnackbar } from '../utils/snackbar';

const BASE_URL = import.meta.env.VITE_BACKEND_API

export const signup = async (userData: IAuth): Promise<IAuthDTO> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, {
            username: userData.username,
            email: userData.email,
            password: userData.password,
            confirm_password: userData.confirmPassword,
            age_declaration: userData.ageDeclaration,
            cgu_accepted: userData.termOfUse
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 201) {
            throw new Error('Oups ! Une erreur est survenue lors de la création de compte');
        }

        showSnackbar('Compte créé avec succès', true);
        return response.data;
    } catch (error) {
        console.error(error);
        showSnackbar('Oups ! Veuillez vérifier vos informations', false);
        throw error;
    }
}