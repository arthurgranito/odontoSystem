import api from "./api";
import type { PacienteFormData, PacienteResponse } from "../types/Paciente";

export class PacienteService {
  private static readonly BASE_PATH = '/pacientes';

  static async getAll(): Promise<PacienteResponse[]> {
    try {
      const response = await api.get<PacienteResponse[]>(this.BASE_PATH);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw error;
    }
  }

  static async getById(id: number): Promise<PacienteResponse> {
    try {
      const response = await api.get<PacienteResponse>(`${this.BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar paciente ${id}:`, error);
      throw error;
    }
  }

  static async create(data: PacienteFormData): Promise<PacienteResponse> {
    try {
      const response = await api.post<PacienteResponse>(this.BASE_PATH, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar paciente:', error);
      throw error;
    }
  }

  static async update(id: number, data: Partial<PacienteFormData>): Promise<PacienteResponse> {
    try {
      const response = await api.put<PacienteResponse>(`${this.BASE_PATH}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar paciente ${id}:`, error);
      throw error;
    }
  }

  static async delete(id: number): Promise<void> {
    try {
      await api.delete(`${this.BASE_PATH}/${id}`);
    } catch (error) {
      console.error(`Erro ao excluir paciente ${id}:`, error);
      throw error;
    }
  }

  static async search(query: string): Promise<PacienteResponse[]> {
    try {
      const response = await api.get<PacienteResponse[]>(`${this.BASE_PATH}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      throw error;
    }
  }
}