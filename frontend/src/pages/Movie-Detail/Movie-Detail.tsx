import "./Movie-Detail.scss";
import RecipeCard from "../../components/Recipe-Card/Recipe-Card"; 
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { recipes, movies } from "../Home/data"; 
import type { IMovieDTO } from "../../interfaces/movie"; 
import type { IRecipeDTO } from "../../interfaces/recipe"; 
import PacmanLoader from "react-spinners/PacmanLoader";

const MovieDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    // Le state utilise directement le type des données (IMovieDTO)
    const [movie, setMovie] = useState<IMovieDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovie = () => {
            try {
                setLoading(true);
                const allMovies = movies as IMovieDTO[]; 
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

    // Réintroduction du type local pour les recettes
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
        movie: movie, 
    });

    return (
        <div className="movie-detail">
            <div className="movie-page-content"> 
                
                <div className="movie-info-container">
                    
                    <div className="movie-title-mobile">
                        <h1>{movie.title}</h1>
                    </div>
                    
                    <img
                        src={movie.image} 
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
                                <RecipeCard
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