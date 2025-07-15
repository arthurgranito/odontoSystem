import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { ConsultaService } from '../services/consultaService';
import type { ConsultaResponse, ConsultaFilter } from '../types/Consulta';
import { ERROR_MESSAGES } from '../constants';

interface UseConsultasReturn {
  consultas: ConsultaResponse[];
  isLoading: boolean;
  error: string | null;
  fetchConsultas: (filters?: ConsultaFilter) => Promise<void>;
  refreshConsultas: () => Promise<void>;
}

export const useConsultas = (initialFilters?: ConsultaFilter): UseConsultasReturn => {
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ConsultaFilter | undefined>(initialFilters);

  const fetchConsultas = useCallback(async (filters?: ConsultaFilter) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filtersToUse = filters || currentFilters;
      setCurrentFilters(filtersToUse);
      
      const data = await ConsultaService.getAll(filtersToUse);
      setConsultas(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao buscar consultas:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentFilters]);

  const refreshConsultas = useCallback(() => {
    return fetchConsultas(currentFilters);
  }, [fetchConsultas, currentFilters]);

  return {
    consultas,
    isLoading,
    error,
    fetchConsultas,
    refreshConsultas,
  };
};