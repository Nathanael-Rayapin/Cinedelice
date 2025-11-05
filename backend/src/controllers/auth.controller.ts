import * as argon2 from "argon2";
import type { Request, Response } from "express";
import { BadRequestError, ConflictError, UnauthorizedError } from "../lib/errors.ts";
import { prisma } from "../models/index.ts";
import { generateAccessToken, verifyAndDecodeJWT} from "../lib/tokens.ts";

//========Inscription d'un utilisateur=============

export async function registerUser(req: Request, res: Response) {
  // On récupère les données envoyées par le client dans le corps de la requête
  const { username, email, password, confirmPassword, age_declaration, cgu_accepted } = req.body;
 
  // Vérifier que tous les champs obligatoires sont bien présents
  if (!username || !email || !password || !confirmPassword  || age_declaration !== true || cgu_accepted !== true) {
    throw new BadRequestError("Tous les champs sont obligatoires.");
  }

  // Vérifier que l'email n'est pas déjà utilisé
  const alreadyExistingUser = await prisma.user.findFirst({ where: { email } });
  if (alreadyExistingUser) {
    throw new ConflictError("L'email ou le mot de passe ne correspondent pas");
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
      cgu_accepted,
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
  const user = await prisma.user.findUnique({ where: { email } });
  // SI KO => 401 : l'utilisateur et le mot de passe ne correspondent pas
  if (! user) {
    throw new UnauthorizedError("L'email ou le mot de passe ne correspondent pas");
  }

  // Comparer le mot de passe en clair avec le mot de passe haché de la BDD
  const isMatching = await argon2.verify(user.password, password);
  // SI KO => 401 : l'utilisateur et le mot de passe ne correspondent pas
  if (! isMatching) {
    throw new UnauthorizedError("L'email ou le mot de passe ne correspondent pas");
  }
  //  Génère le token JWT 
  const { token } = generateAccessToken(user.id, user.role);

  // Retourner les informations de l'utilisateur (sans mot de passe)
  res.status(200).json({
    message:"connexion réussie",
    token,
    user:{
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      created_at: user.created_at
    }
  });
};
//===================Mon profil================
export async function getMe(req:Request, res:Response){
  //verifier si le header authorization existe
  const authHeader = req.headers.authorization;
  if(!authHeader){
    throw new UnauthorizedError("Token manquant dans le header Authorization");
  }
  //extraire le token du header(il est sous la forme 'Bearer xxx')
  const token = authHeader.split(" ")[1];
  //verifier et decoder le token
  const {userId}=verifyAndDecodeJWT(token);
  //recuperer utilisateur qui correspond à la BDD
  const user = await prisma.user.findUnique({
    where:{
      id:userId
    },
    select:{
      id:true,
      username:true,
      email:true,
      role:true,
      created_at:true
    },
  });
  //si aucun user trouvé alors 401
  if (!user){
    throw new UnauthorizedError("Utilisateur non trouvé");
  }
  //sinon retourner les infos de l'user
  res.status(200).json({
    message:"Utilisateur connecté",
    user,
  });
}
//======================= Deconnexion=============