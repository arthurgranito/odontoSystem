import { useState, useMemo, useCallback } from 'react';

export interface PaginationItem {
  type: 'page' | 'ellipsis';
  value: number | string;
  isActive?: boolean;
}

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  paginatedItems: <T>(items: T[]) => T[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
  paginationItems: PaginationItem[];
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const totalPages = useMemo(() => 
    Math.ceil(totalItems / itemsPerPage),
    [totalItems, itemsPerPage]
  );

  const canGoNext = useMemo(() => 
    currentPage < totalPages,
    [currentPage, totalPages]
  );

  const canGoPrevious = useMemo(() => 
    currentPage > 1,
    [currentPage]
  );

  const paginatedItems = useCallback(<T,>(items: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(validPage);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    if (canGoNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [canGoNext]);

  const goToPreviousPage = useCallback(() => {
    if (canGoPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [canGoPrevious]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const paginationItems = useMemo((): PaginationItem[] => {
    const items: PaginationItem[] = [];
    
    if (totalPages <= 5) {
      // Show all pages if 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push({
          type: 'page',
          value: i,
          isActive: i === currentPage,
        });
      }
    } else {
      // Complex pagination with ellipsis
      if (currentPage <= 3) {
        // Show first 3 pages + ellipsis + last page
        for (let i = 1; i <= 3; i++) {
          items.push({
            type: 'page',
            value: i,
            isActive: i === currentPage,
          });
        }
        items.push({ type: 'ellipsis', value: '...' });
        items.push({
          type: 'page',
          value: totalPages,
          isActive: totalPages === currentPage,
        });
      } else if (currentPage >= totalPages - 2) {
        // Show first page + ellipsis + last 3 pages
        items.push({
          type: 'page',
          value: 1,
          isActive: 1 === currentPage,
        });
        items.push({ type: 'ellipsis', value: '...' });
        for (let i = totalPages - 2; i <= totalPages; i++) {
          items.push({
            type: 'page',
            value: i,
            isActive: i === currentPage,
          });
        }
      } else {
        // Show first page + ellipsis + current-1, current, current+1 + ellipsis + last page
        items.push({
          type: 'page',
          value: 1,
          isActive: 1 === currentPage,
        });
        items.push({ type: 'ellipsis', value: '...' });
        
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push({
            type: 'page',
            value: i,
            isActive: i === currentPage,
          });
        }
        
        items.push({ type: 'ellipsis', value: '...' });
        items.push({
          type: 'page',
          value: totalPages,
          isActive: totalPages === currentPage,
        });
      }
    }
    
    return items;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrevious,
    paginationItems,
  };
};