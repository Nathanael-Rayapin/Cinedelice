import express from "express";
import { router } from "./routers/index.ts";
import cors from "cors";

export const app = express();

// Autoriser les requêtes cross-origin
//le front à accéder à l’API
app.use(cors({
  origin:"*",// remplacer ici par http du front
}));

// Middleware pour parser le JSON
app.use(express.json());

// Brancher le routeur de l'API
app.use("/api", router);
