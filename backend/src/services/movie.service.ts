import axios from "axios";
import { config } from "../../config.ts";
import { prisma } from "../models/index.ts";
const TMDB_API_KEY = config.tmdbApiKey;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Service pour chercher un film dans l'API TMDb
export async function searchMovieInTmdb(title: string){
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query:title,
      language: "fr-FR",
    }
  });
  console.log("TMBD RESULTS:",response.data);
  return response.data;
}
// Service pour récupérer le réalisateur d'un film depuis TMDb
export async function getMovieDirectorFromTmdb(movieId: number) {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/credits`, {
    params: {
      api_key: TMDB_API_KEY,
      language: "fr-FR"
    }
  });

  const crew = response.data.crew;

  // On cherche la personne qui a le job "Director"
  const director = crew.find((person: any) => person.job === "Director");

  return director ? director.name : "Inconnu";
}
// Service pour trouver ou créer un film dans notre BDD à partir de TMDb
export async function findOrCreateMovieFromTmdb(title: string) { 
// on appel notre service pour chercher le film dans TMDB 
  const tmdbResults = await searchMovieInTmdb(title);
  // On recupere le premier film trouvé dans TMBD
  const movie = tmdbResults.results[0];
  // si aucun film trouvé on retourne null
  if(!movie)return null;
  // on va chercher le nom du réalisateur grace a l'Id Tmbd du film
  const director = await getMovieDirectorFromTmdb(movie.id);

  // si trouvé on verifie si le film existe déjà dans notre BDD
  let movieInDB = await prisma.movie.findUnique({
    where:{
      id_movie_tmdb:movie.id
    }
  });
    // si le film n'existe pas en BDD on le crée
  if(!movieInDB){
    movieInDB = await prisma.movie.create({
      data:{
        id_movie_tmdb:movie.id,
        title:movie.title,
        synopsis:movie.overview || "Pas de synopsis disponible.",
        image: movie.poster_path  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "https://dummyimage.com/500x750/cccccc/000000.jpg&text=No+Image",
        release_year: movie.release_date || "0000.00.00",
        director: director || "Inconnu"
      }
    });
  }
  return movieInDB;
}
