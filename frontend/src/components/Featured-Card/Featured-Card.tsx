import { FcLike } from "react-icons/fc"
import type { IRecipeDTO } from "../../interfaces/recipe"
import { useNavigate } from "react-router";
import './Featured-Card.scss';

const FeaturedCard = ({ recipe }: { recipe: IRecipeDTO }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/recettes/${recipe.id}`, { state: { recipe } });
    };

    return (
        <div key={recipe.id} className="featured-card" onClick={handleClick}>
            <img src={recipe.image} alt={recipe.title} />
            <div className="featured-content">
                <h3>{recipe.title}</h3>
                <p className="author">{recipe.user.username}</p>
                <div className="featured-footer">
                    <div className="likes">
                        <FcLike />
                        <span>2456</span>
                    </div>
                    <span className={`badge ${recipe.category}`}>
                        {recipe.category.name}
                    </span>

                </div>
            </div>
        </div>
    )
}

export default FeaturedCard