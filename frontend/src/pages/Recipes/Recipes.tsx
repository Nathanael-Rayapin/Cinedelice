import './Recipes.scss';
import { useEffect, useState } from 'react';
import { getRecipes } from '../../services/recipes';
import { type IRecipe } from '../../interfaces/recipe';
import PacmanLoader from 'react-spinners/PacmanLoader';
import FeaturedCard from '../../components/Featured-Card/Featured-Card';        

const Recipes = () => {
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);  

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                setLoading(true);
                await new Promise(res => setTimeout(res, 1000));
                const recipes = await getRecipes();
                setRecipes(recipes);
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

    return (
        <div className="recipes">
            {recipes.map((recipe) => (
                <FeaturedCard key={recipe.id} recipe={recipe} />
            ))}
        </div>
    );
};

export default Recipes;
