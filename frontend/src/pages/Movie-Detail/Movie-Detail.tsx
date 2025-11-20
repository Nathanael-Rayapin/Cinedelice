import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { getRecipes } from "../../services/recipes.service";
import { getOneMovie } from "../../services/movies.service";
import type { IRecipeDTO } from "../../interfaces/recipe";
import PacmanLoader from "react-spinners/PacmanLoader";
import type { IMovieDTO } from "../../interfaces/movie";
import RecipeCard from "../../components/Recipe-Card/Recipe-Card";
import "./Movie-Detail.scss";

// Composant MovieDetail affichant les détails d'un film et ses recettes associées
const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [movie, setMovie] = useState<IMovieDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [associatedRecipes, setAssociatedRecipes] = useState<IRecipeDTO[]>([]);

    // Récupérer les détails du film et les recettes associées
    useEffect(() => {
        const fetchMovieAndRecipes = async () => {
            try {
                setLoading(true);
                if (!id) {
                    setErrorMsg('Film non trouvé');
                    return;
                }

                const movieId = Number(id);
                const fetchedMovie = await getOneMovie(movieId);
                setMovie(fetchedMovie);

                // Récupérer toutes les recettes et filtrer côté client par movie_id
                const allRecipes = await getRecipes();
                const associated = allRecipes.filter((r) => r.movie_id === fetchedMovie.id);
                setAssociatedRecipes(associated);
            } catch (error) {
                if (error instanceof Error) setErrorMsg(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieAndRecipes(); 
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    if (errorMsg || !movie) {
        return <p className="error-msg">{errorMsg || "Film non trouvé"}</p>;
    }

    return (
        <div className="movie-detail">
            <div className="movie-page-content">

                <div className="movie-info-container">
                    <div className="movie-title-mobile">
                        <h1>{movie.title}</h1>
                    </div>

                    <div className="movie-poster">
                        <img
                            src={movie.image}
                            alt={movie.title}
                        />
                    </div>

                    <div className="movie-synopsis-container">
                        <p className="synopsis">
                            <strong>Synopsis :</strong> {movie.synopsis}
                        </p>
                    </div>
                </div>

                {associatedRecipes.length > 0 && (
                    <section className="associated-recipes">
                        <div className="recipes-header">
                            <h2>Recettes associées</h2>
                        </div>
                        <div className="recipes-list">
                            {associatedRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    hasDraft={false}
                                    recipe={recipe}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

export default MovieDetail;