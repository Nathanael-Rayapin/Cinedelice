import { LuClapperboard } from "react-icons/lu"
import { TbChefHat } from "react-icons/tb"
import { IoMdTime } from "react-icons/io"
import { FcLike } from "react-icons/fc"
import { IoChatbubbles } from "react-icons/io5"
import type { IRecipeDTO } from "../../interfaces/recipe"
import { useNavigate } from "react-router"
import './Recipe-Cover.scss';

const RecipeCover = ({ recipe, isSeeRecipeVisible }: { recipe: IRecipeDTO, isSeeRecipeVisible: boolean }) => {
    const navigate = useNavigate();

    return (
        <div className="recipe-cover">
            <img src={recipe.image} alt="Image de la recette" />
            <div className="recipe-content">
                <h1>{recipe.title}</h1>

                <div className="recipe-infos">
                    <div className="info-item">
                        <LuClapperboard color="#fff" size={24} />
                        <p>{recipe.title}</p>
                    </div>
                    <div className="info-item">
                        <TbChefHat color="#fff" size={24} />
                        <p>{recipe.user.username}</p>
                    </div>
                    <div className="info-item">
                        <IoMdTime color="#fff" size={24} />
                        <p>{recipe.preparation_time}</p>
                    </div>
                </div>

                <div className={`recipe-infos ${isSeeRecipeVisible ? 'with-button' : 'no-button'}`}>
                    <div className="info-item">
                        <FcLike size={24} />
                        <p>3000</p>
                    </div>
                    <div className="info-item">
                        <IoChatbubbles color="#fff" size={24} />
                        <p>48</p>
                    </div>
                    {isSeeRecipeVisible && <button className="btn m-1" onClick={() => navigate(`/recettes/${recipe.id}`)}>Voir la recette</button>}
                </div>
            </div>
        </div>
    )
}

export default RecipeCover