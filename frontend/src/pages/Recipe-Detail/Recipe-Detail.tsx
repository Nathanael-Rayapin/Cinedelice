import { useParams } from 'react-router';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useEffect, useState } from 'react';
import { getOneRecipe } from '../../services/recipes.service';
import PacmanLoader from 'react-spinners/PacmanLoader';
import { PiTimerDuotone } from "react-icons/pi";
import { TbPointFilled } from "react-icons/tb";
import './Recipe-Detail.scss';

const RecipeDetail = () => {
    const params = useParams();
    const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);

                const recipeId = parseInt(params.id as string, 10);
                if (isNaN(recipeId)) {
                    throw new Error('Invalid ID format');
                }

                const recipe = await getOneRecipe(recipeId);
                setRecipe(recipe);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [params.id]);

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

    return recipe &&
        <div className="recipe-detail">
            <RecipeCover recipe={recipe!} isSeeRecipeVisible={false} />

            <div className="detail">
                <div className="preparation">
                    <div className="preparation-header">
                        <h2>Préparation</h2>
                        <span className={`badge ${recipe.category}`}>
                            {recipe.category.name}
                        </span>
                    </div>
                    <div className="preparation-steps">
                        {recipe.preparation_steps
                            // On sépare les étapes par le caractère ';'
                            .split(';')
                            .map((step, index) => {
                                // On supprime les espaces et les retours à la ligne
                                const trimmedStep = step.trim();
                                if (!trimmedStep) return null;
                                return (
                                    <div key={index} className="step">
                                        <h3>Étape {index + 1}</h3>
                                        <p>{trimmedStep}</p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <div className="ingredients">
                    <div className="ingredients-header">
                        <h2>Ingrédients</h2>
                        <div className="preparation-time">
                            <PiTimerDuotone size={24} color="#0d1b2a" />
                            <span>{recipe.preparation_time} min</span>
                        </div>
                    </div>
                    <div className="ingredients-list">
                        <ul>
                            {recipe.ingredients.split(';').map((ingredient, index) => (
                                <li key={index}><TbPointFilled />{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
};

export default RecipeDetail;