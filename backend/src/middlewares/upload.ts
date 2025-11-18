import multer from "multer";
import type{ Request, Response, NextFunction } from "express";

import { BadRequestError } from "../lib/errors.ts";

// Stockage en mémoire (buffer)
const storage = multer.memoryStorage();

// Configuration Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite 5MB
  },
}).single("image");

// Middleware personnalisé pour gérer proprement les erreurs Multer
export function uploadImage(req:Request, res:Response, next:NextFunction) {
  upload(req, res, (err) => {
    // Erreur Multer (taille, problème de parsing, etc.)
    if (err instanceof multer.MulterError) {

      // Fichier trop volumineux
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new BadRequestError("Le fichier est trop volumineux (max 5MB)"));
      }

      // Autres erreurs Multer
      return next(new BadRequestError("Erreur lors de l'upload du fichier"));
    }

    // Validation MIME (si un fichier est présent)
    if (req.file) {
      const allowedMime = ["image/jpeg", "image/png", "image/webp"];

      if (!allowedMime.includes(req.file.mimetype)) {
        return next(
          new BadRequestError(
            "Format d'image non supporté. Formats acceptés : jpeg, png, webp"
          )
        );
      }
    }

    next();
  });
}