import axios from "axios";
import { config } from "../../config.ts";

const TMDB_API_KEY = config.tmdbApiKey;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovieInTmdb(title: string){
  const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
    params: {
      api_key: TMDB_API_KEY,
      query:title
    }
  });
  console.log("TMBD RESULTS:",response.data);
  return response.data;
}

