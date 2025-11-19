import { useContext, useEffect, useState } from 'react';
import { getRecipes } from '../../services/recipes.service';
import { type IRecipeDTO } from '../../interfaces/recipe';
import RecipeCard from '../../components/Recipe-Card/Recipe-Card';
import { GlobalUIContext } from '../../store/interface';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from '../../components/Pagination-Controls/Pagination-Controls';
import { usePageMeta } from '../../hooks/usePageMeta';
import { pageMetadata } from '../../utils/pageMetadata';
import './Recipes.scss';
import { useLocation } from 'react-router';

const Recipes = () => {
  const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  usePageMeta(pageMetadata.recipes);

  const { currentItems, currentPage, pageNumbers, goToPage, goToNextPage, goToPreviousPage } =
    usePagination(recipes, 8);

  const location = useLocation();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const searchParams = new URLSearchParams(location.search);
        const categorie = searchParams.get('categorie') || undefined;
        const recipes = await getRecipes(categorie ? { categorie } : undefined);
        setRecipes(recipes);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [location.search]);

  return (
    <div className='recipes-container'>
      <h1>Catalogue de recettes</h1>
      <div className="recipes-list">
        {currentItems.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} hasDraft={false} />
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        pageNumbers={pageNumbers}
        goToPage={goToPage}
        goToNextPage={goToNextPage}
        goToPreviousPage={goToPreviousPage}
      />
    </div>
  );
};

export default Recipes;