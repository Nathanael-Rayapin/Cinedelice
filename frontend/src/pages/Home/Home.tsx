import TabBar from '../../components/Tab-Bar/Tab-Bar';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import FeaturedCard from '../../components/Featured-Card/Featured-Card';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import { useEffect, useState } from 'react';
import { getRecipes } from '../../services/recipes.service';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { movies } from './data';
import PacmanLoader from 'react-spinners/PacmanLoader';
import './Home.scss';

const Home = () => {
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [recipesToShow, setRecipesToShow] = useState(2);
    const [moviesToShow, setMoviesToShow] = useState(2); // Nouvel état pour les films

    const tabs = ['Pour vous', 'Tendances', 'Favoris'];

    // Détection de la taille d'écran pour ajuster le nombre de recettes ET de films
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setRecipesToShow(8); // Desktop
                setMoviesToShow(4);  // Desktop - 4 films
            } else if (window.innerWidth >= 769) {
                setRecipesToShow(4); // Tablette
                setMoviesToShow(4);  // Tablette - 4 films
            } else {
                setRecipesToShow(2); // Mobile
                setMoviesToShow(2);  // Mobile - 2 films
            }
        };

        // Appeler au chargement
        handleResize();

        // Écouter les changements de taille
        window.addEventListener('resize', handleResize);

        // Nettoyer l'écouteur
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                await new Promise(res => setTimeout(res, 1000));

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
            <RecipeCover recipe={recipes[0]} />

            <h2>Recettes à la une</h2>
            <section className="featured-recipes">
                {recipes.slice(-recipesToShow).reverse().map((recipe) => (
                    <FeaturedCard key={recipe.id} recipe={recipe} />
                ))}
            </section>

            <div className="featured-movies">
                <div className="movies-header">
                    <h2>Parcourir par films</h2>
                    <a href="/films">Tout voir</a>
                </div>

                <div className="movies-list">
                    {movies.slice(0, moviesToShow).map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            </div>
        </div>
}

export default Home