//Fichier de configuration réutilisable
//Cela évite de les répéter dans plusieurs fichiers et facilite la maintenance.
export const config = {
  port: parseInt(process.env.PORT || "3000"),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpireIn: process.env.JWT_EXPIRES_IN
};
