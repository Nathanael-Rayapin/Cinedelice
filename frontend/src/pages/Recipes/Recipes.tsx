import './Recipes.scss'; //Import du fichier de styles spécifique à cette page
import { useEffect, useState } from 'react'; //Hooks essentiels pour gérer l'état et les effets de bord
import { getRecipes } from '../../services/recipes'; //Fonction asynchrone pour récupérer les recettes depuis un service
import { type IRecipe } from '../../interfaces/recipe'; //Interface TypeScript pour typer les données des recettes
import PacmanLoader from 'react-spinners/PacmanLoader'; //Composant de chargement visuel
import FeaturedCard from '../../components/Featured-Card/Featured-Card'; //Composant personnalisé pour afficher chaque recette    
 

const Recipes = () => {
    const [recipes, setRecipes] = useState<IRecipe[]>([]); //Tableau de recettes (initialisé comme tableau vide)
    const [errorMsg, setErrorMsg] = useState<string | null>(null); //Message d'erreur (initialisé à null)
    const [loading, setLoading] = useState(true); //Booléen pour indiquer si les données sont en cours de chargement

    //Le useEffect est utilisé pour charger les recettes au montage du composant (tableau de dépendances vide [])
    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                await new Promise(res => setTimeout(res, 1000)); // simule un délai de 1 seconde
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
                <button onClick={() => window.location.reload()}>Réessayer</button>
            </div>
        );
    }

    //Si tout va bien, les recettes sont affichées sous forme de cartes (FeaturedCard) en utilisant recipes.map
    return (
        <div className="recipes">
            {recipes.map((recipe) => (
                <FeaturedCard key={recipe.id} recipe={recipe} />
            ))}

        </div>
    );
};

export default Recipes;
