import type { IMovieDTO } from './movie';

export interface IRecipeDTO {
  id: number;
  category: { name: string };
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
  user: { username: string };
  movie: IMovieDTO;
}

export interface ICreateRecipeDTO {
  title: string;
  category_id: number;
  movie_id: number;
  number_of_person: number;
  preparation_time: number;
  description: string;
  image: File;
  ingredients: string;
  preparation_steps: string;
  status: StatusType;
}

export interface ICreateRecipe {
  title: string;
  description: string;
  movieTitle: string;
  image: FileList | [];
  ingredients: string;
  preparationSteps: string;
  category: string;
  preparationTime: string;
  numberOfPerson: string;
  status: StatusType;
}

export interface IUpdateRecipeDTO {
  id: number;
  user_id: number;
  category_id: number | null;
  movie_id: number;
  title: string;
  number_of_person: number;
  preparation_time: number;
  description: string | null;
  image: string;
  ingredients: string;
  preparation_steps: string;
  status: StatusType;
  created_at: Date;
  updated_at: Date;
}

export interface IUpdateRecipe {
  title?: string;
  description?: string;
  movieTitle?: string;
  image?: FileList | [];
  ingredients?: string;
  preparationSteps?: string;
  category: string;
  preparationTime?: string;
  numberOfPerson?: string;
  status: boolean;
}

export type StatusType = 'draft' | 'published';
