import { useContext, useEffect, useState } from 'react';
import { getMovies } from '../../services/movies.service';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import { GlobalUIContext } from '../../store/interface';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from '../../components/Pagination-Controls/Pagination-Controls';
import type { IMovieDTO } from '../../interfaces/movie';
import { usePageMeta } from '../../hooks/usePageMeta';
import { pageMetadata } from '../../utils/pageMetadata';
import './Movies.scss';

const Movies = () => {
  const [movies, setMovies] = useState<IMovieDTO[]>([]);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  usePageMeta(pageMetadata.movies);

  const { currentItems, currentPage, pageNumbers, goToPage, goToNextPage, goToPreviousPage } =
    usePagination(movies, 8);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const movies = await getMovies();
        setMovies(movies);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className='movies-container'>
      <h1>Catalogue de films</h1>
      <div className="movies-list">
        {currentItems.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      <PaginationControls
        currentPage={currentPage}
        pageNumbers={pageNumbers}
        goToPage={goToPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
      />
    </div>
  );
};

export default Movies;
