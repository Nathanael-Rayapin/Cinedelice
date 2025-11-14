import { FcLike } from 'react-icons/fc';
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useNavigate } from 'react-router';
import './Recipe-Card.scss';

const RecipeCard = ({ recipe, hasDraft }: { recipe: IRecipeDTO; hasDraft: boolean }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasDraft) {
      navigate(`/mes-recettes/${recipe.id}`, { state: { recipe } });
    } else {
      navigate(`/recettes/${recipe.id}`, { state: { recipe } });
    }
  };

  return (
    <div key={recipe.id} className="recipe-card" onClick={handleClick}>
      <img src={recipe.image} alt={recipe.title} />
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="author">{recipe.user.username}</p>
        <div className="recipe-footer">
          <div className="likes">
            <FcLike />
            <span>2456</span>
          </div>
          <span className={`badge ${recipe.category}`}>{recipe.category.name}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
