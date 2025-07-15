/**
 * Converte hora do formato HH:MM para HH:MM ou HHhMM
 * @param hora - Hora no formato HH:MM ou HH:MM:SS
 * @param formato - Formato de saída ('hm' para HHhMM, 'colon' para HH:MM)
 * @returns Hora formatada
 */
export const converteHora = (
  hora: string, 
  formato: 'hm' | 'colon' = 'hm'
): string => {
  if (!hora || typeof hora !== 'string') {
    return '';
  }

  const horaDividida = hora.split(":");
  
  if (horaDividida.length < 2) {
    return hora; // Retorna original se não conseguir dividir
  }

  const horas = horaDividida[0].padStart(2, '0');
  const minutos = horaDividida[1].padStart(2, '0');

  return formato === 'hm' 
    ? `${horas}h${minutos}` 
    : `${horas}:${minutos}`;
};

export default converteHora;