import { useContext, useEffect, useState } from 'react';
import type { IRecipeDTO } from '../../interfaces/recipe';
import RecipeCard from '../../components/Recipe-Card/Recipe-Card';
import { getMyRecipes } from '../../services/recipes.service';
import { GlobalUIContext } from '../../store/interface';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from '../../components/Pagination-Controls/Pagination-Controls';
import '../Recipes/Recipes.scss';
import './My-Recipe.scss';

// Composant MyRecipe affichant les recettes créées par l'utilisateur avec pagination
const MyRecipe = () => {
  const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  const { currentItems, currentPage, pageNumbers, goToPage, goToNextPage, goToPreviousPage } =
    usePagination(recipes, 8);

  // sélectionner les recettes de l'utilisateur
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const recipes = await getMyRecipes();
        setRecipes(recipes);
      } catch (error) {
        setErrorMsg(error instanceof Error ? error.message : 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (recipes.length === 0) {
    return (
      <div className="no-data-found">
        <h2>Vous n'avez pas encore créé de recettes</h2>
      </div>
    );
  }

  return (
    <div className='recipes-container'>
      <h2>Éditer mes recettes</h2>
      <p>Mes recettes publiées</p>
      <div className="recipes-list">
        {currentItems.filter((recipe) => recipe.status === "published").map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} hasDraft={true} />
        ))}
      </div>
      <p>Mes recettes en cours de rédaction</p>
      <div className="recipes-list">
        {currentItems.filter((recipe) => recipe.status === "draft").map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} hasDraft={true} />
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

export default MyRecipe;
