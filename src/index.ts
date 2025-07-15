// Types
export type { User, AuthResponse, LoginCredentials, RegisterCredentials } from './types/Auth';
export type { Paciente, PacienteFormData, PacienteResponse } from './types/Paciente';
export type { TipoConsulta, TipoConsultaFormData, TipoConsultaSelectOption } from './types/TipoConsulta';
export type { Escala, EscalaFormData, DiaSemana, HorarioDisponivel } from './types/Escala';
export type { 
  Consulta, 
  ConsultaFormData, 
  ConsultaResponse, 
  ConsultaFilter, 
  DashboardStats,
  StatusConsulta 
} from './types/Consulta';

// Services
export { ConsultaService } from './services/consultaService';
export { PacienteService } from './services/pacienteService';
export { TipoConsultaService } from './services/tipoConsultaService';
export * from './services/auth';

// Hooks
export { useAuth } from './hooks/useAuth';
export { useConsultas } from './hooks/useConsultas';
export { usePacientes } from './hooks/usePacientes';
export { usePagination } from './hooks/usePagination';

// Utils
export * from './utils/formatters';

// Constants
export * from './constants';

// Services (legacy - marked as deprecated)
export { default as converteDataParaISO } from './services/converteDataParaISO';
export { default as converteHora } from './services/converteHora';
export { default as calcularIdade } from './services/calcularIdade';
export { default as formatarTelefone } from './services/formataTelefone';