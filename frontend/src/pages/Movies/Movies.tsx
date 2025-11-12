import { useEffect, useState } from 'react';
import { getMovies } from '../../services/movies.service';
import type { IMovieProps } from '../../interfaces/movie';
import PacmanLoader from 'react-spinners/PacmanLoader';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import './Movies.scss';

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
        <>
            <h1>Catalogue de films</h1>
            <div className="movies-list">

                {currentMovies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}


                {/* Boutons de pagination */}
                <div className="pagination">
                    <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="pagination-button"
                    >
                        Précédent
                    </button>

                    {/* Génère dynamiquement un bouton pour chaque numéro de page (de 1 à totalPages) */}
                    {/* Crée un tableau de nombres de 1 à totalPages (ex: [1, 2, 3, ..., totalPages]) */}
                    {/* Parcourt ce tableau et génère un bouton pour chaque numéro de page */}
                    {/* key={number} : Clé unique pour chaque bouton (obligatoire dans une liste React).
                onClick={() => paginate(number)} :
                Appelle la fonction paginate avec le numéro de page (number) pour mettre à jour currentPage.
                className={currentPage === number ? 'active' : ''} :
                Applique la classe active au bouton si currentPage correspond au numéro de page (number).
                Cela permet de mettre en évidence la page actuelle (ex: couleur de fond différente). */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={currentPage === number ? 'active' : ''}
                        >
                            {number}
                        </button>
                    ))}


                    {/* Permet à l'utilisateur d'aller à la page suivante */}
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </>
    );
};

export default Movies;