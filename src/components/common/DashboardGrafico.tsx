import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { useEffect, useState } from "react";
import api from "../../services/api";
import { converteMes } from "../../services/converteMes";
import { useTheme } from "next-themes";

interface DashboardGraficoProps {
  refreshKey?: number;
}

const DashboardGrafico = ({ refreshKey }: DashboardGraficoProps) => {
  const { theme } = useTheme();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [dataGrafico, setDataGrafico] = useState<any[]>([]);
  const dataAtual = new Date().toISOString();
  
  const fetchConsultas = async () => {
    console.log(dataAtual);
    const response = await api.get("/consultas");
    const consultasConcluidas = response.data.filter(
      (c: any) => c.status == "CONCLUIDA"
    );
    setConsultas(consultasConcluidas);

    const agrupado = Object.values(
      consultasConcluidas.reduce((acc: any, curr: any) => {
        const nome = curr.tipoConsulta?.nome || "Outro";
        const valor = curr.valorCobrado || 0;

        if (!acc[nome]) {
          acc[nome] = { name: nome, value: 0 };
        }
        acc[nome].value += valor;

        return acc;
      }, {})
    );

    setDataGrafico(agrupado);

    console.log("Consultas conluídas", consultasConcluidas);
  };

  useEffect(() => {
    fetchConsultas();
    // eslint-disable-next-line
  }, [refreshKey]);

  // Definir cor do gráfico conforme o tema
  const chartColor = theme === "dark" ? "#3AA6B9" : "#0088FE";

  return (
    <div className="col-span-2 bg-white/90 dark:bg-zinc-900/80 rounded-2xl shadow p-6 flex flex-col items-center justify-center">
      <span className="text-lg text-gray-500 mb-2">
        Renda de consultas por categoria do mês de{" "}
        {converteMes(dataAtual.slice(5).slice(0, 2))?.toLowerCase()}
      </span>
      <Card className="w-full">
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataGrafico}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}`,
                  "Valor em R$",
                ]}
              />
              <Bar dataKey="value" fill={chartColor} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardGrafico;
