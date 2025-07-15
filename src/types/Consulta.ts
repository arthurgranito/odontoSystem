import type { Paciente } from './Paciente';
import type { TipoConsulta } from './TipoConsulta';

export type StatusConsulta = 'AGENDADA' | 'CONCLUIDA' | 'CANCELADA';

export interface Consulta {
  id: number;
  dataHoraInicio: string;
  dataHoraFim: string;
  observacoes: string;
  status: StatusConsulta;
  paciente: Paciente;
  tipoConsulta: TipoConsulta;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultaFormData {
  dataHoraInicio: string;
  observacoes: string;
  pacienteId: number;
  tipoConsultaId: number;
}

export interface ConsultaResponse extends Omit<Consulta, 'paciente' | 'tipoConsulta'> {
  paciente: {
    id: number;
    nome: string;
    telefone: string;
    email: string;
  };
  tipoConsulta: {
    id: number;
    nome: string;
    preco: number;
    duracaoEstimadaMinutos: number;
    valorCobrado?: number; // Para compatibilidade
  };
  agendaDisponivel?: {
    id: number;
    data: string;
    horaInicio: string;
    horaFim: string;
  };
  dataConclusao?: string | null;
  valorCobrado?: number;
}

export interface ConsultaFilter {
  status?: StatusConsulta;
  dataInicio?: string;
  dataFim?: string;
  pacienteId?: number;
  tipoConsultaId?: number;
}

export interface DashboardStats {
  consultasHoje: number;
  consultasConcluidas: number;
  consultasCanceladas: number;
  faturamentoTotal: number;
  ticketMedio: number;
}