import './Movies.scss';
import { useEffect, useState } from 'react';
import { getMovies } from '../../services/movies.service';
import type { IMovieProps } from '../../interfaces/movie';
import PacmanLoader from 'react-spinners/PacmanLoader';
import MovieCard from '../../components/Movie-Card/Movie-Card';

const Movies = () => {
    const [movies, setMovies] = useState<IMovieProps[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const moviesPerPage = 8;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const movies = await getMovies();
                setMovies(movies);
            } catch (error) {
                setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    // Pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = movies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(movies.length / moviesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
    const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);

    if (loading) {
        return (
            <div className="loading-container" aria-label="Chargement des films">
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }


    if (errorMsg) {
        return (
            <div className="error-container">
                <p className="error-msg">{errorMsg}</p>
            </div>
        );
    }

    return (
        <div className="movies-container">
            <div className="movies">
                {currentMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
};

export default Movies;