/**
 * Utilitários para formatação de dados
 */

/**
 * Formata telefone para o padrão brasileiro
 * @param telefone - Telefone sem formatação
 * @returns Telefone formatado
 */
export const formatarTelefone = (telefone: string): string => {
  if (!telefone) return '';
  
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '');
  
  // Aplica a máscara baseada no tamanho
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

/**
 * Formata data de nascimento para o padrão brasileiro (sem problemas de fuso horário)
 * @param data - Data no formato ISO ou Date
 * @returns Data formatada DD/MM/YYYY
 */
export const formatarDataNascimento = (data: string | Date): string => {
  if (!data) return '';

  if (typeof data === 'string') {
    // Se a data já está no formato YYYY-MM-DD, usar diretamente
    if (data.includes('-') && data.length === 10) {
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    }

    // Para datas ISO completas, usar UTC para evitar problemas de fuso horário
    const dataObj = new Date(data + 'T00:00:00.000Z');
    if (isNaN(dataObj.getTime())) return '';
    return dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  // Se é um objeto Date
  const dataObj = data;
  if (isNaN(dataObj.getTime())) return '';
  return dataObj.toLocaleDateString('pt-BR');
};

/**
 * Formata valor monetário para o padrão brasileiro
 * @param valor - Valor numérico
 * @returns Valor formatado em R$
 */
export const formatarMoeda = (valor: number): string => {
  if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
  
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

/**
 * Formata data e hora para exibição
 * @param dataHora - Data e hora no formato ISO
 * @returns Data e hora formatadas
 */
export const formatarDataHora = (dataHora: string): string => {
  if (!dataHora) return '';

  try {
    const data = new Date(dataHora);

    if (isNaN(data.getTime())) return '';

    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  } catch (error) {
    return '';
  }
};

/**
 * Formata apenas a data para exibição (sem problemas de fuso horário)
 * @param data - Data no formato ISO
 * @returns Data formatada DD/MM/YYYY
 */
export const formatarData = (data: string): string => {
  if (!data) return '';

  // Se a data já está no formato YYYY-MM-DD, usar diretamente
  if (data.includes('-') && data.length === 10) {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Para datas ISO completas (com horário), extrair apenas a parte da data
  if (data.includes('T')) {
    const dataISO = data.split('T')[0];
    const [ano, mes, dia] = dataISO.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Fallback para outros formatos - usar UTC para evitar problemas de fuso horário
  try {
    const dataObj = new Date(data);
    if (isNaN(dataObj.getTime())) return '';

    // Usar UTC para evitar problemas de fuso horário
    const ano = dataObj.getUTCFullYear();
    const mes = String(dataObj.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(dataObj.getUTCDate()).padStart(2, '0');

    return `${dia}/${mes}/${ano}`;
  } catch (error) {
    return '';
  }
};

/**
 * Formata apenas a hora para exibição
 * @param dataHora - Data e hora no formato ISO ou apenas hora (HH:MM)
 * @returns Hora formatada HH:MM
 */
export const formatarHora = (dataHora: string): string => {
  if (!dataHora) return '';

  // Se já está no formato HH:MM, retornar diretamente
  if (dataHora.match(/^\d{2}:\d{2}$/)) {
    return dataHora;
  }

  // Se é uma data completa, extrair apenas a hora
  try {
    const data = new Date(dataHora);

    if (isNaN(data.getTime())) return '';

    return data.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Sao_Paulo'
    });
  } catch (error) {
    return '';
  }
};

/**
 * Remove formatação de telefone
 * @param telefone - Telefone formatado
 * @returns Apenas números
 */
export const limparTelefone = (telefone: string): string => {
  return telefone.replace(/\D/g, '');
};

/**
 * Valida se o email tem formato válido
 * @param email - Email para validar
 * @returns true se válido
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Valida se o telefone tem formato válido
 * @param telefone - Telefone para validar
 * @returns true se válido
 */
export const validarTelefone = (telefone: string): boolean => {
  const numeros = limparTelefone(telefone);
  return numeros.length === 10 || numeros.length === 11;
};



/**
 * Formata data de cadastro (createdAt) para exibição
 * @param dataHora - Data e hora no formato ISO
 * @returns Data formatada DD/MM/YYYY
 */
export const formatarDataCadastro = (dataHora: string): string => {
  if (!dataHora) return '';

  try {
    // Para datas ISO completas (com horário), extrair apenas a parte da data
    if (dataHora.includes('T')) {
      const dataISO = dataHora.split('T')[0];
      const [ano, mes, dia] = dataISO.split('-');
      return `${dia}/${mes}/${ano}`;
    }

    // Fallback para outros formatos
    const data = new Date(dataHora);
    if (isNaN(data.getTime())) return '';

    return data.toLocaleDateString('pt-BR', {
      timeZone: 'America/Sao_Paulo'
    });
  } catch (error) {
    return '';
  }
};