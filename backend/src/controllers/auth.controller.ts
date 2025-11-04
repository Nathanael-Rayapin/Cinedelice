import * as argon2 from "argon2";
import type { Request, Response } from "express";
import { BadRequestError, ConflictError, UnauthorizedError } from "../lib/errors.ts";
import { prisma } from "../models/index.ts";
import { generateAuthenticationTokens, saveRefreshToken, setTokensInCookies } from "../lib/tokens.ts";

//========Inscription d'un utilisateur=============

export async function registerUser(req: Request, res: Response) {
  // On récupère les données envoyées par le client dans le corps de la requête
  const { username, email, password, age_declaration } = req.body;
 
  // Vérifier que tous les champs obligatoires sont bien présents
  if (!username || !email || !password || age_declaration !== true) {
    throw new BadRequestError("Tous les champs sont obligatoires.");
  }

  // Vérifier que l'email n'est pas déjà utilisé
  const alreadyExistingUser = await prisma.user.findFirst({ where: { email } });
  if (alreadyExistingUser) {
    throw new ConflictError("Cet email existe déjà !");
  }

  // Hasher le mot de passe (argon2) pour éviter de le stocker en clair
  const hash = await argon2.hash(password);

  // =====Créer l'utilisateur en BDD=====
  const createdUser = await prisma.user.create({ 
    data: {
      username,
      email,
      password: hash,
      age_declaration,
      role: "user", // par défaut, tout nouvel utilisateur est "user"
    }});

  // Renvoyer les infos de l'utilisateur au client (sans son MDP)
  res.status(201).json({
    id: createdUser.id,
    username: createdUser.username,
    email: createdUser.email,
    role:createdUser.role,
    created_at: createdUser.created_at
  });
}

// ===================Connexion=====================

export async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;

  // Récupérer l'utilisateur en BDD via son email
  const user = await prisma.user.findFirst({ where: { email } });
  // SI KO => 401 : l'utilisateur et le mot de passe ne correspondent pas
  if (! user) {
    throw new UnauthorizedError("L'email et le mot de passe ne correspondent pas");
  }

  // Comparer le mot de passe en clair avec le mot de passe haché de la BDD
  const isMatching = await argon2.verify(user.password, password);
  // SI KO => 401 : l'utilisateur et le mot de passe ne correspondent pas
  if (! isMatching) {
    throw new UnauthorizedError("L'email et le mot de passe ne correspondent pas");
  }

  // Générer des tokens d'accès
  // - 1h
  // - payload : userId + role
  // - signer : JWT_SECRET
  const { accessToken, refreshToken } = generateAuthenticationTokens(user);
  await saveRefreshToken(user, refreshToken);

  // Renvoyer le token 
  // 1) L'accrocher dans les cookies
  setTokensInCookies(res, accessToken, refreshToken);

  // L'envoyer dans le body de la réponse
  res.json({ accessToken, refreshToken });
}

//======================= Deconnexion=============

export async function logoutUser(req: Request, res: Response) {
  // Comment on déconnecte l'utilisateur ? 
  // Ca dépend comment il a stocké le token !
  // -> si stocké dans le localStorage -> c'est le front qui le retire du localStorage, et le tour est joué ! 
  // -> si stocké dans les cookies -> c'est le backend qui set les cookies du front ! -> c'est au backend d'envoyer un nouveau cookie pour remplacer celui existant
  res.cookie("accessToken", "DELETED", { maxAge: 1000 });
  res.cookie("refreshToken", "DELETED", { maxAge: 1000 });
  res.status(204).json({ status: 204, message: "Successfully logged out" });

  // Remarque : on pourrait aussi supprimer le refresh token de la BDD, mais mieux vaut utiliser un CRON pour ce genre de chose
  // CRON = tâche périodique sur la machine (ex : un script qui se lance tous les matins à 9h pour surppimer les refresh token expiré)
}

