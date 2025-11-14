import { useEffect, useState } from 'react';
import { getMovies } from '../../services/movies.service';
import type { IMovieDTO } from '../../interfaces/movie';
import PacmanLoader from 'react-spinners/PacmanLoader';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import './Movies.scss';

const Movies = () => {
    const [movies, setMovies] = useState<IMovieDTO[]>([]);
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

    // Fonction pour générer les numéros de pages à afficher
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxVisiblePages = 7; // Nombre maximum de boutons visibles

        if (totalPages <= maxVisiblePages) {
            // Si peu de pages, afficher toutes les pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Logique pour afficher : première page ... pages autour de la page actuelle ... dernière page
            const leftSiblingIndex = Math.max(currentPage - 1, 1);
            const rightSiblingIndex = Math.min(currentPage + 1, totalPages);

            const shouldShowLeftDots = leftSiblingIndex > 2;
            const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

            if (!shouldShowLeftDots && shouldShowRightDots) {
                // Cas: 1 2 3 4 5 ... 10
                const leftRange = 5;
                for (let i = 1; i <= leftRange; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (shouldShowLeftDots && !shouldShowRightDots) {
                // Cas: 1 ... 6 7 8 9 10
                pageNumbers.push(1);
                pageNumbers.push('...');
                const rightRange = 5;
                for (let i = totalPages - rightRange + 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else if (shouldShowLeftDots && shouldShowRightDots) {
                // Cas: 1 ... 4 5 6 ... 10
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

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
        <>
            <h1>Catalogue de films</h1>
            <div className="movies-list">
                {currentMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
                {/* Boutons de pagination */}
                <div className="pagination">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Précédent
                    </button>

                    {/* Affichage intelligent des numéros de pages */}
                    {getPageNumbers().map((pageNumber, index) => {
                        if (pageNumber === '...') {
                            return (
                                <span key={`dots-${index}`} className="pagination-dots">
                                    ...
                                </span>
                            );
                        }

                        return (
                            <button
                                key={pageNumber}
                                onClick={() => paginate(pageNumber as number)}
                                className={currentPage === pageNumber ? 'active' : ''}
                            >
                                {pageNumber}
                            </button>
                        );
                    })}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Suivant
                    </button>
                </div>
        </>
    );
};

export default Movies;