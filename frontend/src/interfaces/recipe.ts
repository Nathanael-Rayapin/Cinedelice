export interface IRecipe {
    id: number
    category: ICategory;
    category_id: number;
    description: string;
    image: string;
    ingredients: string;
    movie_id: number;
    number_of_person: number;
    preparation_steps: string;
    preparation_time: number;
    status: StatusType;
    title: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    user: IUser;
}

export interface IUser {
    username: string;
}

interface ICategory {
    name: string;
}

// type CategoryType = "Entrées" | "Plats" | "Desserts";

type StatusType = "draft" | "published";