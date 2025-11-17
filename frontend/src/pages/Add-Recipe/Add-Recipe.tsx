import { IoIosSearch } from "react-icons/io";
import CategoriesDropdown from "../../components/Categories-Dropdown/Categories-Dropdown";
import { useContext, useEffect, useRef, useState } from "react";
import { searchMovies } from "../../services/movies.service";
import type { ITmdbMovieDTO } from "../../interfaces/movie";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import type { ICreateRecipe, ICreateRecipeDTO } from "../../interfaces/recipe";
import "./Add-Recipe.scss"
import { GlobalUIContext } from "../../store/interface";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { createRecipe } from "../../services/recipes.service";

const AddRecipe = () => {
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<ITmdbMovieDTO | null>(null);
  const [results, setResults] = useState<ITmdbMovieDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [preparationTime, setPreparationTime] = useState<number | null>(null);
  const [numberOfPerson, setNumberOfPerson] = useState<number | null>(null);

  const { setShowModal, setModalOptions } = useContext(GlobalUIContext);
  const skipNextSearch = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    control,
    reset,
    getValues,
  } = useForm<ICreateRecipe>();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    const handler = setTimeout(async () => {
      const filteredMovies = await searchMovies(query);
      setResults(filteredMovies.slice(0, 10));
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  const onSubmit: SubmitHandler<ICreateRecipe> = async (data) => {
    if (!selectedMovie) return;

    let categoryId: number;

    switch (data.category) {
      case "Entrées":
        categoryId = 1;
        break;
      case "Plats":
        categoryId = 2;
        break;
      case "Desserts":
        categoryId = 3;
        break;
      default:
        categoryId = 1;
        break;
    }

    const form = new FormData();
    form.append("title", data.title);
    form.append("category_id", categoryId.toString());
    form.append("movie_id", selectedMovie.id.toString());
    form.append("number_of_person", data.numberOfPerson.toString());
    form.append("preparation_time", data.preparationTime.toString());
    form.append("description", data.description);
    form.append("image", data.image[0]);
    form.append("ingredients", data.ingredients);
    form.append("preparation_steps", data.preparationSteps);
    form.append("status", "published");

    try {
      await createRecipe(form);
    } catch (error) {
      console.error('Erreur lors de la création de la recette', error);
    } finally {
      console.log("FINALLY");
    }
  };

  const handleChangeQuery = (value: string) => {
    skipNextSearch.current = false;
    setQuery(value);
  };

  const handleClickQuery = (movie: ITmdbMovieDTO) => {
    skipNextSearch.current = true;
    setQuery(movie.title);
    setSelectedMovie(movie);
    setResults([]);
  };

  const handleImagePreview = () => {
    const imageFileList = getValues("image");
    const file = imageFileList?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setModalOptions({ image: previewUrl });
    setShowModal(true);
  }

  return (
    <div className='add-recipe-container'>
      <h2>Création d’une recette</h2>

      <form
        role="form"
        onSubmit={handleSubmit(onSubmit)}
        data-valid={isValid}
      >
        <div className="form-infos">
          <div className="left-container">

            {/* Titre de la recette */}
            <label htmlFor="title">Titre de la recette</label>
            <input
              id="title"
              className="title-recipe custom-style"
              type="text"
              placeholder="Poulet basquaise..."
              {...register('title', {
                required: { value: true, message: "Le titre de la recette est obligatoire" },
                minLength: {
                  value: 10,
                  message: "Le titre de la recette doit contenir au moins 10 caractères",
                },
                maxLength: {
                  value: 100,
                  message: "Le titre de la recette ne peut pas dépasser 100 caractères",
                },
                pattern: {
                  value: /^[a-zA-ZÀ-ÿ0-9\s\-',.()]+$/,
                  message: "Le titre ne peut contenir que des lettres, chiffres, espaces et caractères basiques"
                },
                validate: (value) =>
                  value.trim().length >= 10 || "Le titre de la recette doit contenir au moins 10 caractères"
              })}
            />

            {errors.title && (
              <p className="error" role="alert">
                {errors.title.message as string}
              </p>
            )}

            {/* Image de la recette */}
            <label htmlFor="image">Image de la recette</label>
            <div className="image-recipe">
              <input
                id="image"
                accept="image/*"
                className="file-input"
                type="file"
                {...register('image', {
                  required: { value: true, message: "L'image de la recette est obligatoire" },
                })}
              />
              <button
                type="button"
                onClick={() => handleImagePreview()}
                className={`btn m-1 ${imagePreview ? 'active' : ''}`}>
                Aperçu
              </button>
            </div>

            {errors.image && (
              <p className="error" role="alert">
                {errors.image.message as string}
              </p>
            )}

            {/* Etapes de préparation */}
            <label>Préparations</label>
            <Controller
              name="preparationSteps"
              control={control}
              defaultValue=""
              rules={{
                required: "Les étapes sont obligatoires",
                minLength: {
                  value: 20,
                  message: "Les étapes de préparation doivent contenir au minimum 20 caractères",
                },
                maxLength: {
                  value: 10000,
                  message: "Les étapes de préparation ne peuvent pas dépasser 10000 caractères",
                },
                validate: (value) => {
                  const lines = value.split('\n').filter(line => line.trim().length > 0);
                  return lines.length >= 2 || "La recette doit contenir au moins 2 étapes de préparation (une par ligne)"
                }
              }}
              render={({ field }) => (
                <TextAreaField
                  value={field.value}
                  onChange={field.onChange}
                  options={{ placeholder: "Couper les oignons..." }}
                />
              )}
            />

            {errors.preparationSteps && (
              <p className="error" role="alert">
                {errors.preparationSteps.message as string}
              </p>
            )}

            {/* Temps de préparation */}
            <label htmlFor="preparationTime">Temps de préparation (min)</label>
            <input
              id="preparationTime"
              className="preparation-time custom-style"
              type="text"
              placeholder="45"
              {...register('preparationTime', {
                required: { value: true, message: "Le temps de préparation est obligatoire" },
                minLength: {
                  value: 1,
                  message: "Le temps de préparation doit être au minimum de 1 minute",
                },
                maxLength: {
                  value: 240,
                  message: "Le temps de préparation ne peut pas dépasser 4 heures (240 minutes)",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Le temps de préparation doit être un nombre",
                },
              })}
            />

            {errors.preparationTime && (
              <p className="error" role="alert">
                {errors.preparationTime.message as string}
              </p>
            )}
          </div>

          <div className="right-container">

            {/* Film inspiré de */}
            <label htmlFor="movieTitle">Film inspiré</label>
            <Controller
              name="movieTitle"
              control={control}
              rules={{
                required: "Le film est obligatoire"
              }}
              render={({ field }) => (
                <div className="search">
                  <input
                    id="movieTitle"
                    role="searchbox"
                    type="search"
                    placeholder="Rechercher un film..."
                    value={query}
                    onChange={(e) => {
                      skipNextSearch.current = false;
                      field.onChange(e.target.value);
                      setQuery(e.target.value);
                    }}
                  />
                  <IoIosSearch size={24} color="#D9D9D9" />
                </div>
              )}
            />

            {errors.movieTitle && (
              <p className="error" role="alert">
                {errors.movieTitle.message as string}
              </p>
            )}

            {results && results.length > 0 && (
              <ul className="autocomplete-results">
                {results.map((movie) => (
                  <li key={movie.id}
                    onClick={() => handleClickQuery(movie)}>
                    {movie.title}
                  </li>
                ))}
              </ul>
            )}

            {/* Ingrédients */}
            <label>Ingrédients</label>
            <Controller
              name="ingredients"
              control={control}
              defaultValue=""
              rules={{
                required: "Les ingrédients sont obligatoires",
                minLength: {
                  value: 10,
                  message: "Les ingrédients doivent contenir au minimum 10 caractères",
                },
                maxLength: {
                  value: 5000,
                  message: "Les ingrédients ne peuvent pas dépasser 5000 caractères",
                },
                validate: (value) => {
                  const lines = value.split('\n').filter(line => line.trim().length > 0);
                  return lines.length >= 2 || "La recette doit contenir au moins 2 ingrédients (un par ligne)"
                }
              }}
              render={({ field }) => (
                <TextAreaField
                  value={field.value}
                  onChange={field.onChange}
                  options={{ placeholder: "200g de sel..." }}
                />
              )}
            />

            {errors.ingredients && (
              <p className="error" role="alert">
                {errors.ingredients.message as string}
              </p>
            )}

            {/* Catégorie */}
            <label>Catégorie</label>
            <Controller
              name="category"
              control={control}
              defaultValue=""
              rules={{ required: "La sélection d'une catégorie est obligatoire" }}
              render={({ field }) => (
                <CategoriesDropdown
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.category && (
              <p className="error" role="alert">
                {errors.category.message as string}
              </p>
            )}

            {/* Nombre de personnes */}
            <label htmlFor="numberOfPerson">Nombre de personnes</label>
            <input
              id="numberOfPerson"
              className="number-of-person custom-style"
              type="text"
              placeholder="4"
              {...register('numberOfPerson', {
                required: { value: true, message: "Le nombre de personnes est obligatoire" },
                minLength: {
                  value: 1,
                  message: "Le nombre de personnes doit être au minimum de 1",
                },
                maxLength: {
                  value: 100,
                  message: "Le nombre de personnes ne peut pas dépasser 100",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Le nombre de personnes doit être un nombre",
                },
              })}
            />

            {errors.numberOfPerson && (
              <p className="error" role="alert">
                {errors.numberOfPerson.message as string}
              </p>
            )}

          </div>
        </div>
        <div className="submit-recipe">
          <button
            className="btn m-1 action-btn cancel-btn">
            Annuler
          </button>
          <button
            className="btn m-1 action-btn submit-btn"
            type="submit">
            Confirmer
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;