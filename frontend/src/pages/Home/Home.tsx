import { movies, recipes } from './data';
import TabBar from '../../components/Tab-Bar/Tab-Bar';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import FeaturedCard from '../../components/Featured-Card/Featured-Card';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import './Home.scss'

const Home = () => {   
    const tabs = ['Pour vous', 'Tendances', 'Favoris'];
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    return (
        <div className="home">
            <TabBar tabs={tabs} />
            <RecipeCover recipe={randomRecipe} />
            
            <h2>Recettes à la une</h2>
            <section className="featured-recipes">
                {recipes.map((recipe) => (
                    <FeaturedCard recipe={recipe} />
                ))}
            </section>

            <div className="featured-movies">
                <div className="movies-header">
                    <h2>Parcourir par films</h2>
                    <a href="#">Tout voir</a>
                </div>

                <div className="movies-list">
                    {movies.map((movie) => (
                        <MovieCard movie={movie} /> 
                    ))}
                </div>
            </div>
         </div>   
    );
}

export default Home