export default function formatarDataNascimento(valor: string) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
  if (valor.length > 5)
    valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  return valor.slice(0, 10);
}
