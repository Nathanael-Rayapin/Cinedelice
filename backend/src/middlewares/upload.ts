// récupère l'image envoyée via un formulaire multipart/form-data
import multer from 'multer';

// Ici on dit à Multer de garder l'image en mémoire (Buffer)
const storage = multer.memoryStorage();

export const uploadImage = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },// Limite la taille des fichiers à 5MB
});
