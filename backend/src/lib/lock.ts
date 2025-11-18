// Un simple Set en mémoire pour stocker les IDs de recettes en cours de mise à jour.
// Si un recipeId est présent dans ce Set → cela veut dire qu'une mise à jour est en cours.
// Cela permet d'empêcher les requêtes simultanées pour la même recette.
export const recipeUpdateLocks = new Set<number>();