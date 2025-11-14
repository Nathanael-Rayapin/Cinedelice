import { useContext, useEffect, useState } from 'react';
import { getMovies, type IFakeMovie } from '../../services/movies.service';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import { GlobalUIContext } from '../../store/interface';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from '../../components/Pagination-Controls/Pagination-Controls';
import './Movies.scss';

const Movies = () => {
  const [movies, setMovies] = useState<IFakeMovie[]>([]);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  const { currentItems, currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage } =
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
    <>
      <h1>Catalogue de films</h1>
      <div className="movies-list">
        {currentItems.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
        />
      </div>
    </>
  );
};

export default Movies;
