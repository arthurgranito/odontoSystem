import api from "./api";
import type { TipoConsulta, TipoConsultaFormData } from "../types/TipoConsulta";

export class TipoConsultaService {
  private static readonly BASE_PATH = '/tipos-consulta';

  static async getAll(): Promise<TipoConsulta[]> {
    try {
      const response = await api.get<TipoConsulta[]>(this.BASE_PATH);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar tipos de consulta:', error);
      throw error;
    }
  }

  static async getById(id: number): Promise<TipoConsulta> {
    try {
      const response = await api.get<TipoConsulta>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar tipo de consulta ${id}:`, error);
      throw error;
    }
  }

  static async create(data: TipoConsultaFormData): Promise<TipoConsulta> {
    try {
      const response = await api.post<TipoConsulta>(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de consulta:', error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<TipoConsultaFormData>): Promise<TipoConsulta> {
    try {
      const response = await api.put<TipoConsulta>(`${this.BASE_PATH}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar tipo de consulta ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir tipo de consulta ${id}:`, error);
      throw error;
    }
  }
}