import { useEffect, useState, useCallback } from 'react';
import type { IRecipeDTO } from '../interfaces/recipe';
import type { IMovieDTO } from '../interfaces/movie';
import { getRecipes } from '../services/recipes.service';
import { getMovies } from '../services/movies.service';

// Interface pour les résultats de recherche
export interface ISearchResult {
  id: number;
  title: string;
  type: 'recipe' | 'movie';
  image?: string;
  description?: string;
}
// Hook personnalisé pour la recherche de recettes et de films
export const useSearch = () => {
  const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
  const [movies, setMovies] = useState<IMovieDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les données au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recipesData, moviesData] = await Promise.all([getRecipes(), getMovies()]);
        setRecipes(recipesData);
        setMovies(moviesData);
      } catch (error) {
        console.error('Error fetching search data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chercher et filtrer les résultats
  const search = useCallback(
    (query: string): ISearchResult[] => {
      if (!query.trim()) return [];

      const q = query.toLowerCase();

      // Résultats de recherche pour les recettes
      const recipeResults: ISearchResult[] = recipes
        .filter((recipe) => recipe.title.toLowerCase().includes(q))
        .map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          type: 'recipe' as const,
          image: recipe.image,
          description: recipe.description,
        }));

        // Résultats de recherche pour les films
      const movieResults: ISearchResult[] = movies
        .filter((movie) => movie.title.toLowerCase().includes(q))
        .map((movie) => ({
          id: movie.id,
          title: movie.title,
          type: 'movie' as const,
          image: movie.image,
        }));

      // Fusionner et limiter à 8 résultats
      return [...recipeResults, ...movieResults].slice(0, 8);
    },
    [recipes, movies]
  );

  return { search, loading };
};
