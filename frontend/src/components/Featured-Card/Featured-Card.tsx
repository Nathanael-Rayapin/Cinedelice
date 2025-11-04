import { FcLike } from "react-icons/fc"
import type { IRecipeProps } from "../../interfaces/recipe"
import './Featured-Card.scss';

const FeaturedCard = ({ recipe }: { recipe: IRecipeProps }) => {
    return (
        <div key={recipe.id} className="featured-card">
            <img src={recipe.img} alt={recipe.title} />
            <div className="featured-content">
                <h3>{recipe.title}</h3>
                <p className="author">{recipe.author}</p>
                <div className="featured-footer">
                    <div className="likes">
                        <FcLike />
                        <span>{recipe.likes.toLocaleString()}</span>
                    </div>
                    <span className={`badge ${recipe.badge}`}>
                        {recipe.badge.charAt(0).toUpperCase() + recipe.badge.slice(1)}
                    </span>
                    
                </div>
            </div>
        </div>
    )
}

export default FeaturedCard