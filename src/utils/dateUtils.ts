/**
 * Utilitários para formatação de datas
 */

/**
 * Converte uma data para o formato ISO DateTime esperado pelo backend
 * @param date - Data a ser convertida
 * @param isEndOfDay - Se true, define para o final do dia (23:59:59)
 * @returns String no formato ISO DateTime
 */
export const formatDateTimeForAPI = (date: Date, isEndOfDay: boolean = false): string => {
  const newDate = new Date(date);
  
  if (isEndOfDay) {
    newDate.setHours(23, 59, 59, 999);
  } else {
    newDate.setHours(0, 0, 0, 0);
  }
  
  return newDate.toISOString();
};

/**
 * Converte uma string de data (YYYY-MM-DD) para DateTime ISO
 * @param dateString - String da data no formato YYYY-MM-DD
 * @param isEndOfDay - Se true, define para o final do dia (23:59:59)
 * @returns String no formato ISO DateTime
 */
export const convertDateStringToDateTime = (dateString: string, isEndOfDay: boolean = false): string => {
  // Se já está no formato DateTime, retorna como está
  if (dateString.includes('T')) {
    return dateString;
  }
  
  // Se é apenas data (YYYY-MM-DD), converter para DateTime
  if (dateString.length === 10) {
    const time = isEndOfDay ? 'T23:59:59.999Z' : 'T00:00:00.000Z';
    const date = new Date(dateString + time);
    return date.toISOString();
  }
  
  return dateString;
};

/**
 * Obtém o início e fim do dia atual no formato DateTime ISO
 * @returns Objeto com dataInicio e dataFim
 */
export const getTodayDateTimeRange = () => {
  const hoje = new Date();
  
  return {
    dataInicio: formatDateTimeForAPI(hoje, false),
    dataFim: formatDateTimeForAPI(hoje, true)
  };
};

/**
 * Converte uma data para o formato brasileiro (DD/MM/YYYY)
 * @param date - Data a ser convertida
 * @returns String no formato DD/MM/YYYY
 */
export const formatDateToBR = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
};

/**
 * Converte uma data para o formato de input HTML (YYYY-MM-DD)
 * @param date - Data a ser convertida
 * @returns String no formato YYYY-MM-DD
 */
export const formatDateToInput = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString().slice(0, 10);
};