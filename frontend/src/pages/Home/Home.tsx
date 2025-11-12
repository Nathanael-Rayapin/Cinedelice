import TabBar from '../../components/Tab-Bar/Tab-Bar';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import FeaturedCard from '../../components/Featured-Card/Featured-Card';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import { useEffect, useState } from 'react';
import { getRecipes } from '../../services/recipes.service';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { movies } from './data';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { NavLink } from 'react-router';
import './Home.scss';

const Home = () => {
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const tabs = ['Pour vous', 'Tendances', 'Favoris'];
    const nbrMovieToShow = 4;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const recipes = await getRecipes();
                setRecipes(recipes);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    // Loading State
    if (loading) {
        return (
            <div className="loading-container">
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    // Error State
    if (errorMsg) {
        return <p className="error-msg">{errorMsg}</p>;
    }

    return recipes && recipes.length > 0 &&
        <div className="home">
            <TabBar tabs={tabs} />
            <RecipeCover recipe={recipes[0]} isSeeRecipeVisible={true} />

            <div className="featured-recipes">
                <div className="recipes-header">
                    <h2>Recettes à la une</h2>
                    <NavLink to="/recettes">
                        Tout voir
                    </NavLink>
                </div>
                <section className="recipes-list">
                    {recipes.map((recipe) => (
                        <FeaturedCard key={recipe.id} recipe={recipe} />
                    ))}
                </section>
            </div>

            <div className="featured-movies">
                <div className="movies-header">
                    <h2>Parcourir par films</h2>
                    <NavLink to="/films">
                        Tout voir
                    </NavLink>
                </div>

                <section className="movies-list">
                    {movies.slice(0, nbrMovieToShow).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </section>
            </div>
        </div>
}

export default Home