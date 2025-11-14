import { useParams } from 'react-router';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useContext, useEffect, useState } from 'react';
import { getMyRecipe, getOneRecipe } from '../../services/recipes.service';
import { PiTimerDuotone } from 'react-icons/pi';
import { TbPointFilled } from 'react-icons/tb';
import { GlobalUIContext } from '../../store/interface';
import './Recipe-Detail.scss';

interface IRecipeDetailProps {
  showDraft: boolean;
}

const RecipeDetail = ({ showDraft }: IRecipeDetailProps) => {
  const params = useParams();
  const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
  const { setLoading, setErrorMsg } = useContext(GlobalUIContext);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const recipeId = parseInt(params.id as string, 10);
        if (isNaN(recipeId)) {
          throw new Error('Invalid ID format');
        }

        if (showDraft) {
          setRecipe(await getMyRecipe(recipeId));
        } else {
          setRecipe(await getOneRecipe(recipeId));
        }
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

  return (
    recipe && (
      <div className="recipe-detail">
        <RecipeCover recipe={recipe!} isSeeRecipeVisible={false} />

        <div className="detail">
          <div className="preparation">
            <div className="preparation-header">
              <h2>Préparation</h2>
              <span className={`badge ${recipe.category}`}>{recipe.category.name}</span>
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
                  <li key={index}>
                    <TbPointFilled />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="details-footer">
          <h2>{recipe.movie.title}</h2>
          <div className="content">
            <div className="content-cover">
              <img src={recipe.movie.image} alt="image" />
            </div>

            <div className="content-infos">
              <p>
                Synopsis : <span>{recipe.movie.synopsis}</span>
              </p>
              <p>
                Année de sortie : <span>{recipe.movie.release_year}</span>
              </p>
              <p>
                Réalisateur : <span>{recipe.movie.director}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default RecipeDetail;
