import { useOutletContext } from "react-router";
import RecipeCover from "../../components/Recipe-Cover/Recipe-Cover";
import type { IRecipeDTO } from "../../interfaces/recipe";

interface IOutletContext {
  recipes: IRecipeDTO[];
}

const ForYou = () => {
  const { recipes } = useOutletContext<IOutletContext>();

  if (!recipes || recipes.length === 0) return null;

  return (
    <RecipeCover recipe={recipes[0]} isSeeRecipeVisible={true} />
  );
};

export default ForYou;