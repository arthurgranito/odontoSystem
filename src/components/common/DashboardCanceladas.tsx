interface Props {
  consultas: any[];
}

const DashboardCanceladas = ({ consultas }: Props) => {
  const calcularConsultasCanceladas = () => {
    const consultasCanceladas = consultas.filter((consulta) => consulta.status === "CANCELADA");
    return consultasCanceladas.length;
  };

  return (
    <div className="col-span-1 bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
      <span className="text-sm text-gray-500 mb-2">
        Consultas Canceladas Hoje
      </span>
      <span className="text-2xl font-bold text-red-500 dark:text-red-300">
        {calcularConsultasCanceladas()}
      </span>
    </div>
  );
};

export default DashboardCanceladas;
