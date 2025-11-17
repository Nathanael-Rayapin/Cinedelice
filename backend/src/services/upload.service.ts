import cloudinary from "../../config/cloudinary.ts";
//Service pour envoyer des images sur Cloudinary et récupérer leur URL
export async function uploadImageToCloudinary(buffer: Buffer) { // buffer venant de multer
  return new Promise<string>((resolve, reject) => {// on retourne une promesse qui résout l'URL de l'image uploadée
    cloudinary.uploader.upload_stream( 
      { folder: 'recipes' }, 
      (error, result) => {
        if (error) {
          return reject(error);
        }
        if (result) {
          resolve(result.secure_url);// URL sécurisée de l'image uploadée
        }
      }
    ).end(buffer);// on envoie le buffer à Cloudinary
  });
}