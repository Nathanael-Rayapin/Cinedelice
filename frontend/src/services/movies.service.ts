import { movies } from "../pages/Home/data"; 

// Pour l'instant on créer les données en dur
// On utilisera pas l'interface réel car sinon il faudra mettre à jour le tableau
// qu'on a créer en dur dans data.ts
interface IFakeMovie {
  id: number;
  title: string;
  img: string;
}

export const getMovies = async (): Promise<IFakeMovie[]> => {
  // on simule un appel API (comme pour Recipes)
  await new Promise(res => setTimeout(res, 500));
  return movies;
};
