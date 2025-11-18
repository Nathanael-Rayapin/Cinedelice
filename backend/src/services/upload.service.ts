import cloudinary from "../../config/cloudinary.ts";
import { InternalServerError } from "../lib/errors.ts";

//Service pour envoyer des images sur Cloudinary et récupérer leur URL
export async function uploadImageToCloudinary(buffer: Buffer): Promise<string> { // buffer venant de multer
  return new Promise((resolve, reject) => {// on retourne une promesse qui résout l'URL de l'image uploadée
    cloudinary.uploader.upload_stream( 
      { folder: 'recipes' }, 
      (error, result) => {
        if (error) {
          return reject(new InternalServerError("Échec de l'upload de l'image sur Cloudinary"));
        }
        if (result) {
          resolve(result.secure_url);// URL sécurisée de l'image uploadée
        }
      }
    ).end(buffer);// on envoie le buffer à Cloudinary
  });
}