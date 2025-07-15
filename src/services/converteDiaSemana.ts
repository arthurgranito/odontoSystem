export const converterDiaSemana = (diaSemana: string) => {
    let diaConvertido: string;
    switch (diaSemana) {
      case "SEGUNDA_FEIRA":
        diaConvertido = "Segunda-feira";
        break;
      case "TERCA_FEIRA":
        diaConvertido = "Terça-feira";
        break;
      case "QUARTA_FEIRA":
        diaConvertido = "Quarta-feira";
        break;
      case "QUINTA_FEIRA":
        diaConvertido = "Quinta-feira";
        break;
      case "SEXTA_FEIRA":
        diaConvertido = "Sexta-feira";
        break;
      case "SABADO":
        diaConvertido = "Sábado";
        break;
      case "DOMINGO":
        diaConvertido = "Domingo";
        break;
      default:
        diaConvertido = "Dia inválido";
        break;
    }
    return diaConvertido;
  };