import { useState } from 'react';

// T représente un type générique pour les objets que l'on souhaite paginer (Recettes, Films, etc.)
export function usePagination<T>(items: T[], itemsPerPage: number = 8) {
  const [currentPage, setCurrentPage] = useState(1);

  // On centralise tout le calcul au même endroit
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastRecipe = currentPage * itemsPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - itemsPerPage;
  const currentItems = items.slice(indexOfFirstRecipe, indexOfLastRecipe);

  const goToPage = (page: number) => setCurrentPage(page);
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  // On met tout ça à disposition
  return {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  };
}
