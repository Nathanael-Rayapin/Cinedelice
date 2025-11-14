import { useContext, useEffect, useState } from 'react'; //Hooks essentiels pour gérer l'état et les effets de bord
import { getRecipes } from '../../services/recipes.service'; //Fonction asynchrone pour récupérer les recettes depuis un service
import { type IRecipeDTO } from '../../interfaces/recipe'; //Interface TypeScript pour typer les données des recettes
import RecipeCard from '../../components/Recipe-Card/Recipe-Card'; //Composant personnalisé pour afficher chaque recette    
import { GlobalUIContext } from '../../store/interface';
import { usePagination } from '../../hooks/usePagination';
import PaginationControls from '../../components/Pagination-Controls/Pagination-Controls';
import './Recipes.scss'; //Import du fichier de styles spécifique à cette page

const Recipes = () => {
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]); //Tableau de recettes (initialisé comme tableau vide)
    const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

    const { currentItems, currentPage, totalPages, goToPage, goToNextPage, goToPreviousPage } =
        usePagination(recipes, 8);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const recipes = await getRecipes();
                setRecipes(recipes);
            } catch (error) {
                setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    //Si tout va bien, les recettes sont affichées sous forme de cartes (RecipeCard) en utilisant currentRecipes.map
    return (
        <>
            <h1>Catalogue de recettes</h1>
            <div className="recipes-list">
                {currentItems.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} hasDraft={false} />
                ))}
            </div>

            <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
                goToNextPage={goToNextPage}
                goToPreviousPage={goToPreviousPage}
            />
        </>
    );
};

export default Recipes;