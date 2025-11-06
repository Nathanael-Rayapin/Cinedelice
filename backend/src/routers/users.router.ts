import { Router } from "express";
import * as usersController from "../controllers/users.controller.ts";
import { checkRoles } from "../middlewares/access-control-middleware.ts";

export const router = Router();

// Routes pour l'utilisateur courant (me)
router.delete('/users/me',checkRoles(["admin", "user"]), usersController.deleteAccount);  //- Supprimer son propre compte

// Route spécifique pour le mot de passe
router.patch('/users/me/password',checkRoles(["admin", "user"]), usersController.updatePassword);  //- Modifier son mot de passe

router.get('/users', checkRoles(["admin"]), usersController.getAllUsers);  // - Lister tous les utilisateurs (admin)
router.post('/users',usersController.registerUser);                        // - Créer un nouvel utilisateur

// Routes spécifiques à un utilisateur
router.patch('/users/:id',checkRoles(["admin"]), usersController.updateUserRole); // - Modifier le rôle d'un utilisateur
router.delete('/users/:id',checkRoles(["admin"]), usersController.deleteUser);    // - Supprimer un utilisateur

