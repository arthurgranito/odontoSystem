import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { TrendingUp } from "lucide-react";

interface Props {
  consultas: any[];
}

const DashboardFaturamento = ({ consultas }: Props) => {
  // Filtra consultas concluídas hoje
  const hoje = new Date();
  const hojeStr = hoje.toISOString().slice(0, 10);
  const concluidasHoje = consultas.filter(
    (consulta) =>
      consulta.status === "CONCLUIDA" &&
      consulta.dataConclusao &&
      consulta.dataConclusao.slice(0, 10) === hojeStr
  );

  const total = concluidasHoje.reduce((acc, c) => acc + (c.valorCobrado || 0), 0);
  const ticketMedio = concluidasHoje.length > 0 ? total / concluidasHoje.length : 0;
  const maiorValor = concluidasHoje.reduce((max, c) => Math.max(max, c.valorCobrado || 0), 0);

  return (
    <div className="col-span-1 bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow p-6 flex flex-col gap-4 items-center justify-center min-h-[220px]">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-6 h-6 text-cyan-700 dark:text-cyan-300" />
        <span className="text-base font-semibold text-cyan-900 dark:text-cyan-200">Faturamento do Dia</span>
      </div>
      <span className="text-3xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">
        {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
      </span>
      <div className="flex flex-col w-full gap-1 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Consultas concluídas:</span>
          <span className="font-medium">{concluidasHoje.length}</span>
        </div>
        <div className="flex justify-between">
          <span>Ticket médio:</span>
          <span className="font-medium">{ticketMedio.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
        <div className="flex justify-between">
          <span>Maior valor:</span>
          <span className="font-medium">{maiorValor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
        </div>
      </div>
      <Link to={"/faturamento"} className="mt-2">
        <Button className="cursor-pointer w-full">Ir para Faturamento</Button>
      </Link>
    </div>
  );
};

export default DashboardFaturamento;
