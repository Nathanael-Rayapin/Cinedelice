import TabBar from '../../components/Tab-Bar/Tab-Bar';
import RecipeCard from '../../components/Recipe-Card/Recipe-Card';
import MovieCard from '../../components/Movie-Card/Movie-Card';
import { useContext, useEffect, useState } from 'react';
import { getRecipes } from '../../services/recipes.service';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { NavLink, Outlet } from 'react-router';
import Typewriter from 'typewriter-effect';
import { GlobalUIContext } from '../../store/interface';
import { usePageMeta } from '../../hooks/usePageMeta';
import { pageMetadata } from '../../utils/pageMetadata';
import type { IMovieDTO } from '../../interfaces/movie';
import { getMovies } from '../../services/movies.service';
import './Home.scss';

const Home = () => {
  const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
  const [movies, setMovies] = useState<IMovieDTO[]>([]);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  usePageMeta(pageMetadata.home);

  const tabs = ['Pour vous'];

  // sélectionner les recettes et les films à la une
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);

        const recipes = await getRecipes();
        setRecipes(recipes);

        const movies = await getMovies();
        setMovies(movies);

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

  return (
      <div className="home">
        <h1 className="slogan">
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              strings: ['Quand le cinéma met la main à la pâte'],
              cursor: '_',
              cursorClassName: 'cursor',
            }}
          />
        </h1>

        <TabBar tabs={tabs} />
        <Outlet context={{ recipes }} />

        <div className="featured-recipes">
          <div className="recipes-header">
            <h2>Recettes à la une</h2>
            <NavLink to="/recettes">Tout voir</NavLink>
          </div>
          <section className="recipes-list">
            {recipes.slice(0, 8).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} hasDraft={false} />
            ))}
          </section>
        </div>

        <div className="featured-movies">
          <div className="movies-header">
            <h2>Parcourir par films</h2>
            <NavLink to="/films">Tout voir</NavLink>
          </div>

          <section className="movies-list">
            {movies.slice(0, 4).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </section>
        </div>
      </div>
    )
};

export default Home;
