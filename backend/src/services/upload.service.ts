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

export async function deleteImageFromCloudinary(imageUrl: string): Promise<void> {
  // Extraire le public_id de l'URL de l'image
  const parts = imageUrl.split('/');
  const fileWithExt = parts[parts.length - 1]; // vwcnowfdc6f8lpswyutw.jpg
  const folder = parts[parts.length - 2]; //recipes
  //https://res.cloudinary.com/dmup7k5ta/image/upload/v1763457982/recipes/vwcnowfdc6f8lpswyutw.jpg
  const publicId = `${folder}/${fileWithExt.split('.')[0]}`; // recipes/abc123

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Erreur suppression Cloudinary :", err);
  }
}