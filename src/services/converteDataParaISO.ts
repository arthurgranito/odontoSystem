/**
 * Converte data do formato brasileiro (DD/MM/YYYY) para formato ISO (YYYY-MM-DD)
 * @param dataBR - Data no formato brasileiro (DD/MM/YYYY)
 * @returns Data no formato ISO ou null se inválida
 */
export const converteDataParaISO = (dataBR: string): string | null => {
  if (!dataBR || typeof dataBR !== 'string') {
    return null;
  }

  const [dia, mes, ano] = dataBR.split("/");
  
  if (!dia || !mes || !ano) {
    return null;
  }

  // Validação básica
  const diaNum = parseInt(dia, 10);
  const mesNum = parseInt(mes, 10);
  const anoNum = parseInt(ano, 10);

  if (diaNum < 1 || diaNum > 31 || mesNum < 1 || mesNum > 12 || anoNum < 1900) {
    return null;
  }

  return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
};

export default converteDataParaISO;