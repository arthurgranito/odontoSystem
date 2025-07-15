/**
 * @deprecated Use formatarTelefone from utils/formatters.ts instead
 * Formata telefone para o padrão brasileiro
 * @param valor - Telefone sem formatação
 * @returns Telefone formatado
 */
export default function formatarTelefone(valor: string): string {
  if (!valor) return '';
  
  // Remove tudo que não é número
  let telefone = valor.replace(/\D/g, "");
  
  // Aplica formatação progressiva
  telefone = telefone.replace(/^(\d{2})(\d)/g, "($1) $2");
  telefone = telefone.replace(/(\d{5})(\d)/, "$1-$2");
  
  return telefone.slice(0, 15);
}