import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseAsyncStateReturn<T> extends AsyncState<T> {
  execute: (asyncFunction: () => Promise<T>) => Promise<T>;
  reset: () => void;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Hook personalizado para manejar estados asíncronos de manera consistente
 * @param initialData - Datos iniciales (opcional)
 * @returns Objeto con estado y funciones para manejarlo
 */
export const useAsyncState = <T>(initialData: T | null = null): UseAsyncStateReturn<T> => {
  const [data, setData] = useState<T | null>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (asyncFunction: () => Promise<T>): Promise<T> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setLoading(false);
    setError(null);
  }, [initialData]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    setData,
    setError,
    setLoading
  };
};

/**
 * Hook para manejar listas con operaciones CRUD
 */
export const useAsyncList = <T extends { id: string | number }>(
  initialData: T[] = []
) => {
  const {
    data: items,
    loading,
    error,
    execute,
    reset,
    setData: setItems,
    setError,
    setLoading
  } = useAsyncState<T[]>(initialData);

  const addItem = useCallback((item: T) => {
    setItems(prev => prev ? [...prev, item] : [item]);
  }, [setItems]);

  const updateItem = useCallback((id: string | number, updatedItem: T) => {
    setItems(prev => 
      prev ? prev.map(item => item.id === id ? updatedItem : item) : [updatedItem]
    );
  }, [setItems]);

  const removeItem = useCallback((id: string | number) => {
    setItems(prev => prev ? prev.filter(item => item.id !== id) : []);
  }, [setItems]);

  const findItem = useCallback((id: string | number): T | undefined => {
    return items?.find(item => item.id === id);
  }, [items]);

  return {
    items: items || [],
    loading,
    error,
    execute,
    reset,
    setItems,
    setError,
    setLoading,
    addItem,
    updateItem,
    removeItem,
    findItem
  };
};

/**
 * Hook para manejar operaciones de formulario con validación
 */
export const useAsyncForm = <T>() => {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitForm = useCallback(async (
    submitFunction: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    setSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const result = await submitFunction();
      setSubmitSuccess(true);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error desconocido');
      setSubmitError(error.message);
      onError?.(error);
      return null;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const resetForm = useCallback(() => {
    setSubmitting(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, []);

  return {
    submitting,
    submitError,
    submitSuccess,
    submitForm,
    resetForm
  };
};

/**
 * Hook para manejar paginación
 */
export const usePagination = <T>(
  items: T[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = items.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const goToPreviousPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const goToFirstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const goToLastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  // Reset to first page when items change
  useState(() => {
    setCurrentPage(1);
  });

  return {
    currentPage,
    totalPages,
    currentItems,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    itemsPerPage,
    totalItems: items.length,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, items.length)
  };
};

/**
 * Hook para manejar filtros y búsqueda
 */
export const useFilter = <T>(
  items: T[],
  filterFunction: (item: T, searchTerm: string, filters: Record<string, any>) => boolean
) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filteredItems = items.filter(item => 
    filterFunction(item, searchTerm, filters)
  );

  const updateFilter = useCallback((key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchTerm('');
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    updateFilter,
    removeFilter,
    clearFilters,
    filteredItems,
    hasActiveFilters: searchTerm.length > 0 || Object.keys(filters).length > 0
  };
};

/**
 * Hook para manejar operaciones con debounce
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useState(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  });

  return debouncedValue;
};
