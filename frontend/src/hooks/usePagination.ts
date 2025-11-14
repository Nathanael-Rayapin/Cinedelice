import { useMemo, useState } from 'react';

// T représente un type générique pour les objets que l'on souhaite paginer (Recettes, Films, etc.)
export function usePagination<T>(items: T[], itemsPerPage: number = 8) {
  const [currentPage, setCurrentPage] = useState(1);

  // On centralise tout le calcul au même endroit
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page: number) => setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const pageNumbers = useMemo<(number | string)[]>(() => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;

    if (totalPages <= maxVisiblePages) {
      // Affiche toutes les pages si peu de pages
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const leftSibling = Math.max(currentPage - 1, 1);
      const rightSibling = Math.min(currentPage + 1, totalPages);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < totalPages - 1;

      if (!showLeftDots && showRightDots) {
        // 1 2 3 4 5 ... 10
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (showLeftDots && !showRightDots) {
        // 1 ... 6 7 8 9 10
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push('...');
        for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  // On met tout ça à disposition
  return {
    currentPage,
    currentItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    pageNumbers,
  };
}
