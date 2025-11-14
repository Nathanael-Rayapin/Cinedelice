import axios from "axios";
import { config } from "../../config.ts";
import { prisma } from "../models/index.ts";
import type { MovieJob } from "../@types/express.d.ts";

const TMDB_API_KEY = config.tmdbApiKey;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Récuperer un film depuis Tmbd par son Id
export async function getMovieFromTmdbById(movieId: number) {
  const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
    params: {
      api_key: TMDB_API_KEY,
      language: "fr-FR", // Pour avoir la traduction FR
    },
  });

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
  const director = crew.find((person: MovieJob) => person.job === "Director");

  return director ? director.name : "Inconnu";
}

// Trouve ou crée un film dans NOTRE BDD à partir de l'ID TMDb envoyé par le front
export async function findOrCreateMovieFromId(movieId: number) { 
  // si trouvé on verifie si le film existe déjà dans notre BDD
  let movieInDB = await prisma.movie.findUnique({
    where:{
      id_movie_tmdb:movieId
    }
  });
  // si pas trouvé on le récupère depuis TMDb
  if (movieInDB) return movieInDB;

  // sinon va chercher les infos dans Tmbd
  const movie =  await getMovieFromTmdbById(movieId);
  const director = await getMovieDirectorFromTmdb(movieId);

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
