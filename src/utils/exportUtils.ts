import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { formatarData, formatarHora, formatarDataHora } from './formatters';
import type { ConsultaResponse } from '../types/Consulta';
import type { PacienteResponse } from '../types/Paciente';

/**
 * Exporta consultas para Excel
 */
export const exportarConsultasExcel = (
  consultas: ConsultaResponse[],
  nomeArquivo: string,
  incluirHorario: boolean = true
) => {
  const dadosExport = consultas.map((consulta) => {
    const dados: any = {
      Data: formatarData(consulta.agendaDisponivel?.data || consulta.dataHoraInicio),
      Paciente: consulta.paciente?.nome || '',
      'Tipo de Consulta': consulta.tipoConsulta?.nome || '',
      Status: consulta.status,
      Observações: consulta.observacoes || ''
    };

    if (incluirHorario) {
      dados.Horário = formatarHora(consulta.agendaDisponivel?.horaInicio || consulta.dataHoraInicio);
    }

    // Se for faturamento, incluir valores
    if (consulta.status === 'CONCLUIDA') {
      dados['Valor Cobrado'] = consulta.valorCobrado || consulta.tipoConsulta?.preco || 0;
      dados['Valor Tabela'] = consulta.tipoConsulta?.preco || 0;
    }

    return dados;
  });

  const ws = XLSX.utils.json_to_sheet(dadosExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Consultas");
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const timestamp = format(new Date(), 'dd-MM-yyyy_HH-mm');
  saveAs(data, `${nomeArquivo}_${timestamp}.xlsx`);
  
  toast.success("Relatório exportado com sucesso!");
};

/**
 * Exporta pacientes para Excel
 */
export const exportarPacientesExcel = (pacientes: PacienteResponse[]) => {
  const dadosExport = pacientes.map((paciente) => ({
    Nome: paciente.nome,
    Telefone: paciente.telefone || '',
    Email: paciente.email || '',
    'Data de Nascimento': formatarData(paciente.dataNascimento),
    'Data de Cadastro': formatarData(paciente.createdAt),
    Observações: paciente.observacoes || ''
  }));

  const ws = XLSX.utils.json_to_sheet(dadosExport);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Pacientes");
  
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const timestamp = format(new Date(), 'dd-MM-yyyy_HH-mm');
  saveAs(data, `pacientes_${timestamp}.xlsx`);
  
  toast.success("Lista de pacientes exportada com sucesso!");
};