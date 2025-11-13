import axios from 'axios';
import type { ISignup, ISignin, ISignupDTO, ISigninDTO, IProfileDTO } from '../interfaces/auth';
import { showSnackbar } from '../utils/snackbar';

const BASE_URL = import.meta.env.VITE_BACKEND_API

export const signup = async (userData: ISignup): Promise<ISignupDTO> => {
    try {
        const response = await axios.post(`${BASE_URL}/users`, {
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

export const signin = async (userData: ISignin): Promise<ISigninDTO> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            email: userData.email,
            password: userData.password
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la connexion');
        }
        
        showSnackbar('Connexion réussie', true);
        return response.data;
    } catch (error) {
        console.error(error);
        showSnackbar('Oups ! Veuillez vérifier vos informations', false);
        throw error;
    }
}

export const getProfile = async (): Promise<IProfileDTO> => {
    try {
        const response = await axios.get(`${BASE_URL}/auth/me`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (response.status !== 200) {
            throw new Error('Une erreur est survenue lors de la récupération du profil');
        }
                
        return response.data;
    } catch (error) {
        console.error(error);
        showSnackbar('Oups ! Une erreur est survenue, veuillez réessayer plus tard.', false);
        throw error;
    }
}