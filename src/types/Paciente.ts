export interface Paciente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: Date;
  observacoes: string;
  createdAt: string;
}

export interface PacienteFormData {
  nome: string;
  telefone: string;
  email: string;
  dataNascimento: string;
  observacoes: string;
}

export interface PacienteResponse extends Omit<Paciente, 'dataNascimento'> {
  dataNascimento: string;
}