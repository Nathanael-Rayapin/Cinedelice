export interface IMovieDTO {
  id: number;
  id_movie_tmdb: number;
  title: string;
  synopsis: string;
  image: string;
  release_year: string;
  director: string;
}

// TMDB API
export interface ITmdbMovieDTO {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface ITmdbSearchDTO {
  page: number;
  results: ITmdbMovieDTO[];
  total_pages: number;
  total_results: number;
}

