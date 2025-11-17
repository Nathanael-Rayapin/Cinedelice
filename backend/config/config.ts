//Fichier de configuration réutilisable
//Cela évite de les répéter dans plusieurs fichiers et facilite la maintenance.
export const config = {
  port: parseInt(process.env.PORT || "3000"),
  //Auth
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpireIn: process.env.JWT_EXPIRES_IN,
  //Tmbd
  tmdbApiKey: process.env.TMDB_API_KEY as string,
  //Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
};
