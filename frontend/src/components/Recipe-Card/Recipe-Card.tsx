import { GoHeartFill } from "react-icons/go";
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useNavigate } from 'react-router';
import './Recipe-Card.scss';

// Composant RecipeCard affichant une carte de recette cliquable
const RecipeCard = ({ recipe, hasDraft }: { recipe: IRecipeDTO; hasDraft: boolean }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasDraft) {
      navigate(`/ma-recette/${recipe.id}`, { state: { recipe } });
    } else {
      navigate(`/recettes/${recipe.id}`, { state: { recipe } });
    }
  };

  return (
    <div key={recipe.id} className="recipe-card">
      <img src={recipe.image} alt={recipe.title} onClick={handleClick}/>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="author">{recipe.user.username}</p>
        <div className="recipe-footer">
          <div className="likes">
            <GoHeartFill color='#f44336' size={24} />
            <span>2457</span>
          </div>
          <span className={`badge ${recipe.category}`}>{recipe.category.name}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
