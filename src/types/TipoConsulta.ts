export interface TipoConsulta {
  id: number;
  nome: string;
  preco: number;
  duracaoEstimadaMinutos: number;
}

export interface TipoConsultaFormData {
  nome: string;
  preco: number;
  duracaoEstimadaMinutos: number;
}

export interface TipoConsultaSelectOption {
  value: number;
  label: string;
  preco: number;
  duracao: number;
}