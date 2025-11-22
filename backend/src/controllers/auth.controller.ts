import * as argon2 from "argon2";
import type { Request, Response } from "express";
import { UnauthorizedError } from "../lib/errors.ts";
import { prisma } from "../models/index.ts";
import { generateAccessToken, verifyAndDecodeJWT} from "../lib/tokens.ts";
import { validateLoginUser } from "../validations/auth.validation.ts";

//========Inscription d'un utilisateur=============


// ===================Connexion=====================

export async function loginUser(req: Request, res: Response) {
  const { email, password } = await validateLoginUser(req.body);

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
};