import express from "express";
import { router } from "./routers/index.ts";

export const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Brancher le routeur de l'API
app.use("/api", router);