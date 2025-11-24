import { IoIosSearch } from "react-icons/io";
import CategoriesDropdown from "../../components/Categories-Dropdown/Categories-Dropdown";
import { useContext, useEffect, useRef, useState } from "react";
import { searchMovies } from "../../services/movies.service";
import type { ITmdbMovieDTO } from "../../interfaces/movie";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import type { ICreateRecipe } from "../../interfaces/recipe";
import { GlobalUIContext } from "../../store/interface";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { createDraft, createRecipe } from "../../services/recipes.service";
import { useNavigate } from "react-router";
import { getCategories } from "../../services/categories.service";
import type { ICategoryDTO } from "../../interfaces/category";
import "./Form-Recipe.scss";

const AddRecipe = () => {
  const [categories, setCategories] = useState<ICategoryDTO[]>([]);
  const [query, setQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<ITmdbMovieDTO | null>(null);
  const [results, setResults] = useState<ITmdbMovieDTO[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const { setShowModal, setLoading, setModalOptions, setErrorMsg } = useContext(GlobalUIContext);
  const skipNextSearch = useRef(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    trigger,
    formState: { errors, isValid, isDirty },
    control,
  } = useForm<ICreateRecipe>({
    defaultValues: {
      title: "",
      description: "",
      image: [],
      preparationSteps: "",
      ingredients: "",
      category: "",
      numberOfPerson: "",
      preparationTime: "",
      movieTitle: ""
    },
  });

  // Gestion des résultats de recherche de films
  useEffect(() => {
    // Si le champ de recherche est vide, on réinitialise les résultats
    if (!query) {
      setResults([]);
      return;
    }

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    // Sinon, on recherche les films correspondant au mot-clé de recherche
    const handler = setTimeout(async () => {
      const filteredMovies = await searchMovies(query);
      const uniqueMovies: ITmdbMovieDTO[] = [];
      const titles = new Set<string>();

      filteredMovies.forEach(movie => {
        if (!titles.has(movie.title)) {
          titles.add(movie.title);
          uniqueMovies.push(movie);
        }
      });

      setResults(uniqueMovies.slice(0, 10));
    }, 500);

    return () => clearTimeout(handler);
  }, [query]);

  // Gestion des catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMsg(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<ICreateRecipe> = async (data) => {
    if (!selectedMovie) return;

    const selectedCategory = categories.find(c => c.name === data.category);
    if (!selectedCategory) return;

    const form = buildRecipeFormData(data, selectedCategory);

    try {
      const newRecipe = await createRecipe(form);

      if (newRecipe) {
        reset();
        navigate("/profil/mes-recettes");
      }

    } catch (error) {
      console.error('Erreur lors de la création de la recette', error);
    } finally {
      setLoadingBtn(false);
    }
  };

  const buildRecipeFormData = (data: ICreateRecipe, selectedCategory: ICategoryDTO): FormData => {
    const form = new FormData();
    form.append("title", data.title);
    form.append("category_id", selectedCategory!.id.toString());
    form.append("movie_id", selectedMovie!.id.toString());
    form.append("number_of_person", data.numberOfPerson!.toString());
    form.append("preparation_time", data.preparationTime!.toString());
    form.append("description", data.description);
    form.append("image", data.image[0]);
    form.append("ingredients", data.ingredients);
    form.append("preparation_steps", data.preparationSteps);
    form.append("status", "published");

    return form;
  }

  const buildDraftRecipeFormData = (data: ICreateRecipe): FormData => {
    const selectedCategory = categories.find(c => c.name === data.category);

    const form = new FormData();
    form.append("title", data.title);
    form.append("category_id", selectedCategory ? selectedCategory.id.toString() : "0");
    form.append("movie_id", selectedMovie ? selectedMovie.id.toString() : "0");
    form.append("number_of_person", data.numberOfPerson!.toString());
    form.append("preparation_time", data.preparationTime!.toString());
    form.append("description", data.description);
    form.append("image", data.image[0]);
    form.append("ingredients", data.ingredients);
    form.append("preparation_steps", data.preparationSteps);
    form.append("status", "published");

    return form;
  }

  const handleCancel = async () => {
    const isTitleValid = await trigger("title");

    // On vérifie au moins que le titre est valide
    if (!isTitleValid) {
      window.scrollTo(0, 0);
      return;
    }

    if (isDirty) {
      setModalOptions({
        title: "Quitter le formulaire",
        description: "Vous avez des modifications non enregistrées. Voulez-vous vraiment abandonner vos changements ?",
        cancelButtonContent: "Retour",
        confirmButtonContent: "Enregistrer et quitter",
        type: "default",
        onConfirm: async () => {
          try {
            setLoadingBtn(true);
            const recipe = buildDraftRecipeFormData(getValues());
            await createDraft(recipe);
          } catch (error) {
            console.error('Erreur lors de la création d\'une recette en brouillon', error);
          } finally {
            setLoadingBtn(false);
            navigate("/profil/mes-recettes");
          }
        }
      });
      setShowModal(true);
    } else {
      navigate("/profil/mes-recettes");
    }

    reset();
  }

  const handleChangeQuery = (value: string) => {
    skipNextSearch.current = false;
    setQuery(value);
  };

  const handleClickQuery = (movie: ITmdbMovieDTO) => {
    // Quand je clique sur un film, on set le titre du film dans le champ
    // Mais le fait de setter le titre du film ne dois pas redéclencher le useEffect
    // Donc on met skipNextSearch à true
    skipNextSearch.current = true;
    setQuery(movie.title);
    setSelectedMovie(movie);
    setResults([]);
  };

  const handleImagePreview = () => {
    if (!imagePreview) return;

    setModalOptions({
      image: imagePreview,
      type: "preview",
    });
    setShowModal(true);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

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
                  message: "Le titre ne peut contenir que des lettres, chiffres, espaces et caractères basiques (- ' , . ())"
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
                  onChange: handleFileChange,
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

            {/* Description de la recette */}
            <label htmlFor="description">Description de la recette</label>
            <input
              id="description"
              className="title-recipe custom-style"
              type="text"
              placeholder="Délicieux poulet mijoté aux saveurs basques..."
              {...register('description', {
                required: { value: true, message: "La description de la recette est obligatoire" },
                minLength: {
                  value: 10,
                  message: "Le description de la recette doit contenir au moins 10 caractères",
                },
                maxLength: {
                  value: 500,
                  message: "Le description de la recette ne peut pas dépasser 100 caractères",
                },
                validate: (value) =>
                  value.trim().length >= 10 || "La description de la recette doit contenir au moins 10 caractères"
              })}
            />

            {errors.description && (
              <p className="error" role="alert">
                {errors.description.message as string}
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
                    onClick={() => handleClickQuery(movie)}
                    onChange={() => handleChangeQuery(movie.title)}>
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
              rules={{ required: "La sélection d'une catégorie est obligatoire" }}
              render={({ field }) => (
                <CategoriesDropdown
                  categories={categories}
                  value={field.value}
                  onChange={field.onChange}
                  isResetVisible={false}
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
            className="btn m-1 action-btn cancel-btn"
            type="button"
            onClick={() => handleCancel()}>
            Annuler
          </button>
          <button
            className="btn m-1 action-btn submit-btn"
            type="submit">
            {loadingBtn ? (
              <>
                <span className="loading loading-spinner"></span> Confirmer
              </>
            ) : (
              "Confirmer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRecipe;