import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { PacienteService } from '../services/pacienteService';
import type { PacienteResponse } from '../types/Paciente';
import { ERROR_MESSAGES } from '../constants';

interface UsePacientesReturn {
  pacientes: PacienteResponse[];
  isLoading: boolean;
  error: string | null;
  fetchPacientes: () => Promise<void>;
  searchPacientes: (query: string) => Promise<void>;
  refreshPacientes: () => Promise<void>;
}

export const usePacientes = (): UsePacientesReturn => {
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await PacienteService.getAll();
      setPacientes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao buscar pacientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPacientes = useCallback(async (query: string) => {
    if (!query.trim()) {
      return fetchPacientes();
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await PacienteService.search(query);
      setPacientes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.GENERIC;
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao buscar pacientes:', err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchPacientes]);

  const refreshPacientes = useCallback(() => {
    return fetchPacientes();
  }, [fetchPacientes]);

  return {
    pacientes,
    isLoading,
    error,
    fetchPacientes,
    searchPacientes,
    refreshPacientes,
  };
};