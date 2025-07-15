interface Props {
  consultas: any[];
}

const DashboardConcluidas = ({ consultas }: Props) => {
    const calcularConsultasConcluidas = () => {
        const consultasConcluidas = consultas.filter((consulta) => consulta.dataConclusao != null);
        return consultasConcluidas.length;
    }

  return (
    <div className="col-span-1 bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
      <span className="text-sm text-gray-500 mb-2">
        Consultas Concluídas Hoje
      </span>
      <span className="text-2xl font-bold text-green-600 dark:text-green-300">
        {calcularConsultasConcluidas()}
      </span>
    </div>
  );
};

export default DashboardConcluidas;
