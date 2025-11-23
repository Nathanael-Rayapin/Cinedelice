import { GoHeartFill } from "react-icons/go";
import type { IRecipeDTO } from '../../interfaces/recipe';
import { useNavigate } from 'react-router';
import { useContext, useState } from "react";
import { AuthContext } from "../../store/interface";
import { addLike, removeLike } from "../../services/favourites.service";
import './Recipe-Card.scss';

// Composant RecipeCard affichant une carte de recette cliquable
const RecipeCard = ({ recipe, hasDraft }: { recipe: IRecipeDTO; hasDraft: boolean }) => {
  const [isLikedByMe, setIsLikedByMe] = useState(recipe.likedByMe);
  const [countLikes, setCountLikes] = useState(recipe._count.favourites);
  
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (hasDraft) {
      navigate(`/ma-recette/${recipe.id}`, { state: { recipe } });
    } else {
      navigate(`/recettes/${recipe.id}`, { state: { recipe } });
    }
  };

  const handleLike = async () => {
    if (!authContext.isAuth) return;
    try {
      setIsLikedByMe(true);
      const favourites = await addLike(recipe.id);
      setCountLikes(favourites.totalLikes);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDislike = async () => {
    if (!authContext.isAuth) return;
    try {
      setIsLikedByMe(false);
      const favourites = await removeLike(recipe.id);
      setCountLikes(favourites.totalLikes);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div key={recipe.id} className="recipe-card">
      <img src={recipe.image} alt={recipe.title} onClick={handleClick}/>
      <div className="recipe-content">
        <h3>{recipe.title}</h3>
        <p className="author">{recipe.user.username}</p>
        <div className="recipe-footer">
          <div className="likes">
            {
              isLikedByMe
                ? <GoHeartFill color='#f44336' size={24} onClick={() => handleDislike()} />
                : <GoHeartFill color='#0d1b2a' size={24} onClick={() => handleLike()} />
            }
            <span>{countLikes}</span>
          </div>
          <span className={`badge ${recipe.category}`}>{recipe.category.name}</span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
