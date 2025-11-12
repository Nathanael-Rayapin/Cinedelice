import { useEffect, useState } from 'react'; //Hooks essentiels pour gérer l'état et les effets de bord
import { getRecipes } from '../../services/recipes.service'; //Fonction asynchrone pour récupérer les recettes depuis un service
import { type IRecipeDTO } from '../../interfaces/recipe'; //Interface TypeScript pour typer les données des recettes
import PacmanLoader from 'react-spinners/PacmanLoader'; //Composant de chargement visuel
import RecipeCard from '../../components/Recipe-Card/Recipe-Card'; //Composant personnalisé pour afficher chaque recette    
import './Recipes.scss'; //Import du fichier de styles spécifique à cette page

const Recipes = () => {
    const [recipes, setRecipes] = useState<IRecipeDTO[]>([]); //Tableau de recettes (initialisé comme tableau vide)
    const [errorMsg, setErrorMsg] = useState<string | null>(null); //Message d'erreur (initialisé à null)
    const [loading, setLoading] = useState(true); //Booléen pour indiquer si les données sont en cours de chargement
    const [currentPage, setCurrentPage] = useState(1); //Page actuelle pour la pagination
    const recipesPerPage = 8; //Nombre de recettes à afficher par page

    //Le useEffect est utilisé pour charger les recettes au montage du composant (tableau de dépendances vide [])
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                const recipes = await getRecipes(); //Appel à getRecipes() pour obtenir les recettes
                setRecipes(recipes);
            } catch (error) {
                setErrorMsg(error instanceof Error ? error.message : "Une erreur est survenue."); //Gestion des erreurs avec un message approprié
            } finally {
                setLoading(false); //setLoading(false) est appelé dans le bloc finally pour garantir que le loader disparaisse, même en cas d'erreur
            }
        };

        fetchRecipes();
    }, []);

    // Logique de pagination
    const indexOfLastRecipe = currentPage * recipesPerPage; //Calcule l'index (position) de la dernière recette à afficher sur la page actuelle
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage; //Calcule l'index (position) de la première recette à afficher sur la page actuelle
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe); //Extrait un sous-tableau de recettes à afficher sur la page actuelle, en utilisant les index calculés précédemment
    const totalPages = Math.ceil(recipes.length / recipesPerPage); //Calcule le nombre total de pages nécessaires pour afficher toutes les recettes

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber); // Fonction qui met à jour l'état currentPage avec le numéro de page passé en argument

    //Passe à la page précédente si elle existe
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //Passe à la page suivante si elle existe
    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    //Si loading est true, un composant PacmanLoader est affiché avec une couleur orange (#fB8b24)
    if (loading) {
        return (
            <div className="loading-container" aria-label='Chargement des recettes'>
                <PacmanLoader color="#fB8b24" />
            </div>
        );
    }

    // Si errorMsg n'est pas null, le message d'erreur est affiché dans un paragraphe avec la classe error-msg
    if (errorMsg) {
        return (
            <div className="error-container">
                <p className="error-msg">{errorMsg}</p>
            </div>
        );
    }

    //Si tout va bien, les recettes sont affichées sous forme de cartes (RecipeCard) en utilisant currentRecipes.map
    return (
        <>
            <h1>Catalogue de recettes</h1>
            <div className="recipes-list">
                {currentRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
            </div>

                {/* Boutons de pagination */}
            <div className="pagination">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="pagination-button"
               >
                    Précédent
                </button>

                {/* Génère dynamiquement un bouton pour chaque numéro de page (de 1 à totalPages) */}
                {/* Crée un tableau de nombres de 1 à totalPages (ex: [1, 2, 3, ..., totalPages]) */}
                {/* Parcourt ce tableau et génère un bouton pour chaque numéro de page */}
                {/* key={number} : Clé unique pour chaque bouton (obligatoire dans une liste React).
                onClick={() => paginate(number)} :
                Appelle la fonction paginate avec le numéro de page (number) pour mettre à jour currentPage.
                className={currentPage === number ? 'active' : ''} :
                Applique la classe active au bouton si currentPage correspond au numéro de page (number).
                Cela permet de mettre en évidence la page actuelle (ex: couleur de fond différente). */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={currentPage === number ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}


                {/* Permet à l'utilisateur d'aller à la page suivante */}
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

export default Recipes;
