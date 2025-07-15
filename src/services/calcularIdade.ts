/**
 * Calcula a idade baseada na data de nascimento
 * @param dataNascimento - Data de nascimento no formato Date ou string ISO
 * @returns Idade em anos
 */
export const calcularIdade = (dataNascimento: Date | string): number => {
  if (!dataNascimento) {
    return 0;
  }

  const nascimento = typeof dataNascimento === 'string' 
    ? new Date(dataNascimento) 
    : dataNascimento;

  if (isNaN(nascimento.getTime())) {
    return 0;
  }

  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();

  // Ajusta se ainda não fez aniversário este ano
  if (mesAtual < mesNascimento || 
      (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }

  return Math.max(0, idade);
};

export default calcularIdade;