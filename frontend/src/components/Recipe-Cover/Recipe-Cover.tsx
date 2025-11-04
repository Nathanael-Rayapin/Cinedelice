import { LuClapperboard } from "react-icons/lu"
import { coverRecipe } from "../../pages/Home/data"
import { TbChefHat } from "react-icons/tb"
import { IoMdTime } from "react-icons/io"
import { FcLike } from "react-icons/fc"
import { IoChatbubbles } from "react-icons/io5"
import { useEffect, useState } from "react"
import type { IRecipeProps } from "../../interfaces/recipe"
import './Recipe-Cover.scss';

const RecipeCover = ({ recipe }: { recipe: IRecipeProps }) => {
    const [iconSize, setIconSize] = useState(16);

    // We use useEffect to update the icon size when the window is resized
    useEffect(() => {
        const handleResize = () => {
            setIconSize(window.innerWidth > 769 ? 24 : 16);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="recipe-cover">
            <img src={coverRecipe} alt="Image de la recette" />
            <div className="recipe-content">
                <h1>Burger de Mehdi</h1>

                <div className="recipe-infos">
                    <div className="info-item">
                        <LuClapperboard color="#fff" size={iconSize} />
                        <p>{recipe.title}</p>
                    </div>
                    <div className="info-item">
                        <TbChefHat color="#fff" size={iconSize} />
                        <p>{recipe.author}</p>
                    </div>
                    <div className="info-item">
                        <IoMdTime color="#fff" size={iconSize} />
                        <p>{recipe.duration}</p>
                    </div>
                </div>

                <div className="recipe-infos">
                    <div className="info-item">
                        <FcLike size={iconSize} />
                        <p>{recipe.likes.toLocaleString()}</p>
                    </div>
                    <div className="info-item">
                        <IoChatbubbles color="#fff" size={iconSize} />
                        <p>{recipe.comment.toLocaleString()}</p>
                    </div>
                    <button className="btn m-1">Voir la recette</button>
                </div>
            </div>
        </div>
    )
}

export default RecipeCover