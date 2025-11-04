//Fichier de configuration réutilisable
//Cela évite de les répéter dans plusieurs fichiers et facilite la maintenance.
export const config = {
  port: parseInt(process.env.PORT || "3000"),
};
