import { IoIosSearch } from "react-icons/io";
import CategoriesDropdown from "../../components/Categories-Dropdown/Categories-Dropdown";
import { useContext, useEffect, useRef, useState } from "react";
import { searchMovies } from "../../services/movies.service";
import type { ITmdbMovieDTO } from "../../interfaces/movie";
import TextAreaField from "../../components/TextAreaField/TextAreaField";
import type { IUpdateRecipe, StatusType } from "../../interfaces/recipe";
import { GlobalUIContext } from "../../store/interface";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { getMyRecipe, updateRecipe } from "../../services/recipes.service";
import { useNavigate, useParams } from "react-router";
import { getCategories } from "../../services/categories.service";
import type { ICategoryDTO } from "../../interfaces/category";
import "../Add-Recipe/Form-Recipe.scss";

const UpdateRecipe = () => {
    const [recipeId, setRecipeId] = useState<number>(0);
    const [categories, setCategories] = useState<ICategoryDTO[]>([]);

    const [query, setQuery] = useState("");
    const [selectedMovie, setSelectedMovie] = useState<ITmdbMovieDTO | null>(null);
    const [results, setResults] = useState<ITmdbMovieDTO[]>([]);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loadingBtn, setLoadingBtn] = useState(false);

    const {
        setShowModal,
        setLoading,
        setModalOptions,
        setErrorMsg
    } = useContext(GlobalUIContext);

    const skipNextSearch = useRef(false);
    const navigate = useNavigate();
    const params = useParams();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        control,
    } = useForm<IUpdateRecipe>();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setLoading(true);

                const recipeId = parseInt(params.id as string, 10);
                if (isNaN(recipeId)) {
                    throw new Error('Invalid ID format');
                }

                const recipe = await getMyRecipe(recipeId);
                setRecipeId(recipe.id);                

                reset({
                    title: recipe.title,
                    description: recipe.description,
                    preparationSteps: recipe.preparation_steps
                        .split(' • ')
                        .map((step, i) => i === 0 ? step : `• ${step}`)
                        .join('\n'),
                    // image : On ne peut pas convertir un string en FieList donc on 
                    // insert le string directement dans la preview au lieu de l'input 
                    ingredients: recipe.ingredients
                        .split(' • ')
                        .map((step, i) => i === 0 ? step : `• ${step}`)
                        .join('\n'),
                    category: recipe.category.name,
                    numberOfPerson: recipe.number_of_person.toString(),
                    preparationTime: recipe.preparation_time.toString(),
                    status: recipe?.status === 'published' as StatusType,
                });

                // Set Default Image
                setImagePreview(recipe.movie.image);

                // Set Default Movie
                skipNextSearch.current = true;
                setQuery(recipe.movie.title);
                setResults([]);

            } catch (error) {
                if (error instanceof Error) {
                    setErrorMsg(error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [params.id]);

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

    const onSubmit: SubmitHandler<IUpdateRecipe> = async (data) => {
        const selectedCategory = categories.find(c => c.name === data.category);

        // Si la catégorie ne correspond pas à ce que j'ai en BDD on return
        if (!selectedCategory) return;
        const form = buildRecipeFormData(data, selectedCategory!);

        try {
            const updatedRecipe = await updateRecipe(form, recipeId);

            if (updatedRecipe) {
                reset();
                navigate("/profil/mes-recettes");
            }

        } catch (error) {
            console.error('Erreur lors de la création de la recette', error);
        } finally {
            setLoadingBtn(false);
        }
    };

    const buildRecipeFormData = (data: IUpdateRecipe, selectedCategory: ICategoryDTO): FormData => {
        const form = new FormData();

        form.append("title", data.title || "");
        form.append("category_id", selectedCategory.id.toString() || "3");

        if (selectedMovie && selectedMovie.id) {
            form.append("movie_id", selectedMovie!.id.toString());
        }

        if (data.numberOfPerson) {
            form.append("number_of_person", data.numberOfPerson.toString());
        }

        if (data.preparationTime) {
            form.append("preparation_time", data.preparationTime.toString());
        }

        form.append("description", data.description || "");
        form.append("ingredients", data.ingredients || "");
        form.append("preparation_steps", data.preparationSteps || "");
        form.append("status", data.status ? "published" : "draft");

        if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
            form.append("image", data.image[0]);
        }

        return form;
    }

    const handleCancel = () => {
        const recipeId = parseInt(params.id as string, 10);
        navigate(`/modifier-recette/${recipeId}`);
        reset();
    }

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
                                validate: (value) => {
                                    if (!value || value.trim() === "") return true;

                                    if (value.trim().length < 10)
                                        return "Le titre de la recette doit contenir au moins 10 caractères";

                                    return true;
                                },
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
                                minLength: {
                                    value: 20,
                                    message: "Les étapes de préparation doivent contenir au minimum 20 caractères",
                                },
                                maxLength: {
                                    value: 10000,
                                    message: "Les étapes de préparation ne peuvent pas dépasser 10000 caractères",
                                },
                                validate: (value) => {
                                    if (!value || value.trim() === "") return true;

                                    const lines = value
                                        .split('\n')
                                        .map(l => l.replace(/^•\s?/, ""))
                                        .filter(line => line.trim().length > 0);

                                    if (lines.length < 2) {
                                        return "La recette doit contenir au moins 2 étapes de préparation (une par ligne)";
                                    }

                                    return true;
                                }
                            }}
                            render={({ field }) => (
                                <TextAreaField
                                    value={field.value || ""}
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
                                minLength: {
                                    value: 10,
                                    message: "Le description de la recette doit contenir au moins 10 caractères",
                                },
                                maxLength: {
                                    value: 500,
                                    message: "Le description de la recette ne peut pas dépasser 100 caractères",
                                },
                                validate: (value) => {
                                    if (!value || value.trim() === "") return true;

                                    if (value.trim().length < 10) {
                                        return "La description de la recette doit contenir au moins 10 caractères";
                                    }

                                    return true;
                                }
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
                                minLength: {
                                    value: 10,
                                    message: "Les ingrédients doivent contenir au minimum 10 caractères",
                                },
                                maxLength: {
                                    value: 5000,
                                    message: "Les ingrédients ne peuvent pas dépasser 5000 caractères",
                                },
                                validate: (value) => {
                                    if (!value || value.trim() === "") return true;

                                    const lines = value.split('\n').filter(line => line.trim().length > 0);
                                    return lines.length >= 2 || "La recette doit contenir au moins 2 ingrédients (un par ligne)";
                                }
                            }}
                            render={({ field }) => (
                                <TextAreaField
                                    value={field.value || ""}
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

                        {/* Statut */}
                        <label htmlFor="status">Status</label>
                        <div className="recipe-status">
                            <input
                                id="status"
                                type="checkbox"
                                className="checkbox checkbox-sm checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800"
                                {...register('status')}
                            />
                            <p>Publier</p>
                        </div>
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

export default UpdateRecipe;