import api from "./api";
import type { 
  ConsultaFormData, 
  ConsultaResponse, 
  ConsultaFilter,
  StatusConsulta 
} from "../types/Consulta";
import { getTodayDateTimeRange, convertDateStringToDateTime } from "../utils/dateUtils";

export class ConsultaService {
  private static readonly BASE_PATH = '/consultas';

  static async getAll(filters?: ConsultaFilter): Promise<ConsultaResponse[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.status) params.append('status', filters.status);
      if (filters?.dataInicio) {
        const dataInicioFormatada = convertDateStringToDateTime(filters.dataInicio, false);
        params.append('dataInicio', dataInicioFormatada);
      }
      if (filters?.dataFim) {
        const dataFimFormatada = convertDateStringToDateTime(filters.dataFim, true);
        params.append('dataFim', dataFimFormatada);
      }
      if (filters?.pacienteId) params.append('pacienteId', filters.pacienteId.toString());
      if (filters?.tipoConsultaId) params.append('tipoConsultaId', filters.tipoConsultaId.toString());

      const queryString = params.toString();
      const url = queryString ? `${this.BASE_PATH}?${queryString}` : this.BASE_PATH;
      
      const response = await api.get<ConsultaResponse[]>(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar consultas:', error);
      throw error;
    }
  }

  static async getById(id: number): Promise<ConsultaResponse> {
    try {
      const response = await api.get<ConsultaResponse>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar consulta ${id}:`, error);
      throw error;
    }
  }

  static async create(data: ConsultaFormData): Promise<ConsultaResponse> {
    try {
      const response = await api.post<ConsultaResponse>(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<ConsultaFormData>): Promise<ConsultaResponse> {
    try {
      const response = await api.put<ConsultaResponse>(`${this.BASE_PATH}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar consulta ${id}:`, error);
      throw error;
    }
  }

  static async updateStatus(id: number, status: StatusConsulta): Promise<ConsultaResponse> {
    try {
      const response = await api.patch<ConsultaResponse>(`${this.BASE_PATH}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar status da consulta ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir consulta ${id}:`, error);
      throw error;
    }
  }

  static async getConsultasHoje(): Promise<ConsultaResponse[]> {
    const { dataInicio, dataFim } = getTodayDateTimeRange();
    
    return this.getAll({
      dataInicio,
      dataFim
    });
  }

  static async getConsultasPorPeriodo(dataInicio: string, dataFim: string): Promise<ConsultaResponse[]> {
    return this.getAll({
      dataInicio,
      dataFim
    });
  }
}