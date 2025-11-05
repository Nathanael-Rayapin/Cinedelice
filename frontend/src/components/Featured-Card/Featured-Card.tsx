import { FcLike } from "react-icons/fc"
import type { IRecipe } from "../../interfaces/recipe"
import './Featured-Card.scss';

const FeaturedCard = ({ recipe }: { recipe: IRecipe }) => {
    return (
        <div key={recipe.id} className="featured-card">
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