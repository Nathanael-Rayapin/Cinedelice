import type { IMovieDTO } from './movie';

export interface IRecipeDTO {
  id: number;
  category: ICategoryDTO;
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
  user: IUserDTO;
  movie: IMovieDTO;
}

interface IUserDTO {
  username: string;
}

interface ICategoryDTO {
  name: string;
}

// type CategoryType = "Entrées" | "Plats" | "Desserts";

type StatusType = 'draft' | 'published';
