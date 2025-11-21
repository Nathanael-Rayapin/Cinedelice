import { useNavigate, useParams } from 'react-router';
import RecipeCover from '../../components/Recipe-Cover/Recipe-Cover';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useContext, useEffect, useState } from 'react';
import { deleteRecipe, getMyRecipe, getOneRecipe } from '../../services/recipes.service';
import { PiTimerDuotone } from 'react-icons/pi';
import { TbPointFilled } from 'react-icons/tb';
import { GlobalUIContext } from '../../store/interface';
import './Recipe-Detail.scss';

interface IRecipeDetailProps {
  isCurrentUserRecipes: boolean;
}

// Composant RecipeDetail affichant les détails d'une recette spécifique
const RecipeDetail = ({ isCurrentUserRecipes }: IRecipeDetailProps) => {
  const params = useParams();
  const [recipe, setRecipe] = useState<IRecipeDTO | null>(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const { setLoading, setErrorMsg, setModalOptions, setShowModal } = useContext(GlobalUIContext);
  const navigate = useNavigate();

  // Récupérer les détails de la recette en fonction de où je suis (page public ou privée)
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const recipeId = parseInt(params.id as string, 10);
        if (isNaN(recipeId)) {
          throw new Error('Invalid ID format');
        }

        if (isCurrentUserRecipes) {
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

  const handleUpdateRecipe = () => {
    navigate(`/profil/modifier-recette/${recipe!.id}`);
  }

  const handleDeleteRecipe = async () => {
    // On affiche la Modal mais c'est cette page qui gère la logique métier
    setModalOptions({
      title: "Suppression de la recette",
      description: "Êtes-vous sûr de vouloir supprimer cette recette ?",
      cancelButtonContent: "Annuler",
      confirmButtonContent: "Supprimer",
      type: "delete",
      onConfirm: async () => {
        try {
          setLoadingBtn(true);
          await deleteRecipe(recipe!.id);
        } catch (error) {
          console.error('Erreur lors de la suppression de la recette', error);
        } finally {
          setLoadingBtn(false);
          navigate("/profil/mes-recettes");
        }
      },
    });
    setShowModal(true);
  }

  return (
    recipe && (
      <div className="recipe-detail">
        {
          isCurrentUserRecipes &&
          <div className="actions">
            <button
              className='btn m-1 update-btn'
              onClick={() => handleUpdateRecipe()}>
              Modifier
            </button>
            <button
              className='btn m-1 delete-btn'
              onClick={() => handleDeleteRecipe()}>
              {loadingBtn ? (
                <>
                  <span className="loading loading-spinner"></span> Supprimer
                </>
              ) : (
                "Supprimer"
              )}
            </button>
          </div>
        }
        <RecipeCover recipe={recipe!} isSeeRecipeVisible={false} />



        <div className="detail">
          <div className="preparation">
            <div className="preparation-header">
              <h2>Préparation</h2>
              <span className={`badge ${recipe.category}`}>{recipe.category.name}</span>
            </div>
            <div className="preparation-steps">
              {recipe.preparation_steps
                // On sépare les étapes par le caractère '•'
                .split('•')
                .map(step => step.trim())
                .filter(step => step.length > 0)
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
                {recipe.ingredients
                  .split('•')
                  .map(ingredient => ingredient.trim())
                  .filter(ingredient => ingredient.length > 0)
                  .map((ingredient, index) => (
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
