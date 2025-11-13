import "./Movie-Detail.scss";
import FeaturedCard from "../../components/Featured-Card/Featured-Card";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { recipes, movies } from "../Home/data"; 
import type { IMovieProps } from "../../interfaces/movie";
import type { IRecipeDTO } from "../../interfaces/recipe";
import PacmanLoader from "react-spinners/PacmanLoader";

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<IMovieProps | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = () => {
            try {
                setLoading(true);
                const allMovies = movies; 
                
                const foundMovie = allMovies.find((m) => String(m.id) === id);
                
                if (!foundMovie) {
                    setErrorMsg("Film non trouvé");
                } else {
                    setMovie(foundMovie);
                }
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
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

    // Type local minimal pour les recettes (basé sur le data local)
    interface ILocalRecipe {
        id: number;
        img: string;
        title: string;
        author: string;
        badge?: string;
        movieId: number;
        description?: string;
    }

    // Filtrer les recettes associées à ce film
    const associatedRecipes = (recipes as ILocalRecipe[]).filter(
        (recipe) => recipe.movieId === movie.id
    );

    // Adaptateur pour correspondre à IRecipeDTO
    const adaptRecipeToIRecipeDTO = (recipe: ILocalRecipe): IRecipeDTO => ({
        id: recipe.id,
        category: { name: recipe.badge || "Autre" },
        category_id: 0,
        description: recipe.description || "",
        image: recipe.img,
        ingredients: "",
        movie_id: recipe.movieId,
        number_of_person: 1,
        preparation_steps: "",
        preparation_time: 0,
        status: "published",
        title: recipe.title,
        created_at: "",
        updated_at: "",
        user_id: 0,
        user: { username: recipe.author || "Inconnu" },
    });

    return (
        <div className="movie-detail">
            <div className="movie-page-content"> 
                
                <div className="movie-info-container">
                    
                    <div className="movie-title-mobile">
                        <h1>{movie.title}</h1>
                    </div>
                    
                    <img
                        src={movie.img}
                        alt={movie.title}
                        className="movie-poster"
                    />
                    
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
                            <button
                                onClick={() => navigate("/recettes")}
                                className="see-all"
                            >
                                Tout voir
                            </button>
                        </div>
                        <div className="recipes-grid">
                            {associatedRecipes.map((recipe) => (
                                <FeaturedCard
                                    key={recipe.id}
                                    recipe={adaptRecipeToIRecipeDTO(recipe)}
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