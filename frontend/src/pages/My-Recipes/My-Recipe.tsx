import { useEffect, useState } from "react";
import type { IRecipeDTO } from "../../interfaces/recipe";
import PacmanLoader from "react-spinners/PacmanLoader";
import RecipeCard from "../../components/Recipe-Card/Recipe-Card";
import { getMyRecipes } from "../../services/recipes.service";
import "../Recipes/Recipes.scss"

const MyRecipe = () => {
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const recipesPerPage = 8;

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const recipes = await getMyRecipes();
                setRecipes(recipes);
            } catch (error) {
                setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipes();
    }, []);

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);
    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (loading) {
        return (
            <div className="loading-container" aria-label='Chargement des recettes'>
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="error-container">
                <p className="error-msg">{errorMsg}</p>
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="no-data-found">
                <h2>Vous n'avez pas encore créé de recettes</h2>
            </div>
        );
    }

    return (
        <>
            <div className="recipes-list">
                {currentRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

            <div className="pagination">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Précédent
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Suivant
                </button>
            </div>
        </>
    );
};

export default MyRecipe;