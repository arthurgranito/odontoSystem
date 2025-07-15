import React, { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Função para formatar data e hora no formato brasileiro
const formatarDataHora = (dataHoraISO: string) => {
  if (!dataHoraISO) return '';

  const data = new Date(dataHoraISO);
  const dataFormatada = data.toLocaleDateString('pt-BR');
  const horaFormatada = data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return `${dataFormatada} - ${horaFormatada}`;
};
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import Sidebar from "../components/common/Sidebar";
import DashboardFaturamento from "../components/common/DashboardFaturamento";
import DashboardConcluidas from "../components/common/DashboardConcluidas";
import DashboardCanceladas from "../components/common/DashboardCanceladas";
import DashboardCardConsulta from "../components/common/DashboardCardConsulta";
import DashboardGrafico from "../components/common/DashboardGrafico";
import { ConsultaService } from "../services/consultaService";
import api from "../services/api";
import { usePagination } from "../hooks/usePagination";
import { DASHBOARD_CONSULTAS_PAGE_SIZE, CONSULTA_STATUS } from "../constants";
import type { ConsultaResponse } from "../types/Consulta";
import { 
  Calendar, 
  Users, 
  Clock, 
  Plus, 
  TrendingUp, 
  Activity,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

const Dashboard: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [graficoRefreshKey, setGraficoRefreshKey] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGraficoRefresh = useCallback(() => {
    setGraficoRefreshKey((k) => k + 1);
  }, []);

  const fetchConsultas = useCallback(async () => {
    setIsLoading(true);
    try {
      const consultasDoDia = await ConsultaService.getConsultasHoje();
      setConsultas(consultasDoDia);
    } catch (error) {
      toast.error("Erro ao carregar consultas");
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Função para cancelar consulta
  const cancelarConsulta = async (consultaId: number) => {
    try {
      await api.put(`/consultas/${consultaId}/cancelar`);
      toast.success("Consulta cancelada com sucesso!");
      fetchConsultas(); // Atualizar a lista
      handleGraficoRefresh(); // Atualizar gráficos
    } catch (error: any) {
      console.error('Erro ao cancelar consulta:', error);
      const errorMessage = error.response?.data?.message || "Erro ao cancelar consulta!";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  // Memoized calculations
  const consultasAgendadas = useMemo(() => 
    consultas.filter((consulta) => consulta.status === CONSULTA_STATUS.AGENDADA),
    [consultas]
  );

  const proximosPacientes = useMemo(() => {
    const agora = new Date();
    return consultas
      .filter((c) => c.dataHoraInicio && c.status === CONSULTA_STATUS.AGENDADA)
      .map((c) => ({
        ...c,
        diff: Math.abs(new Date(c.dataHoraInicio).getTime() - agora.getTime())
      }))
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 3);
  }, [consultas]);

  // Pagination hook
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    totalItems: consultasAgendadas.length,
    itemsPerPage: DASHBOARD_CONSULTAS_PAGE_SIZE,
  });

  const consultasPaginadas = paginatedItems(consultasAgendadas);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      
      <main className={`flex-1 transition-all duration-300 ${expanded ? "ml-64" : "ml-16"}`}>
        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Visão geral da sua clínica odontológica
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link to="/agendamento">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Consulta
                </Button>
              </Link>
              <Link to="/pacientes">
                <Button variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Pacientes
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashboardFaturamento consultas={consultas} />
            <DashboardConcluidas consultas={consultas} />
            <DashboardCanceladas consultas={consultas} />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Today's Appointments */}
            <div className="lg:col-span-2">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-cyan-600" />
                      <CardTitle className="text-slate-900 dark:text-slate-100">
                        Consultas de Hoje
                      </CardTitle>
                    </div>
                    <Link to="/consultas">
                      <Button variant="ghost" size="sm">
                        Ver todas
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {consultasAgendadas.length > 0 ? (
                    <>
                      {consultasPaginadas.map((consulta) => (
                        <DashboardCardConsulta
                          key={consulta.id}
                          consulta={consulta}
                          atualizarConsultas={fetchConsultas}
                          atualizarGrafico={handleGraficoRefresh}
                        />
                      ))}
                      
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Página {currentPage} de {totalPages}
                          </p>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToPreviousPage}
                              disabled={!canGoPrevious}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={goToNextPage}
                              disabled={!canGoNext}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                        Nenhuma consulta hoje
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Você não tem consultas agendadas para hoje.
                      </p>
                      <Link to="/agendamento">
                        <Button>
                          <Plus className="w-4 h-4 mr-2" />
                          Agendar Consulta
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Next Patients */}
            <div className="space-y-6">
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-600" />
                    <CardTitle className="text-slate-900 dark:text-slate-100">
                      Próximos Pacientes
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent>
                  {proximosPacientes.length > 0 ? (
                    <div className="space-y-3">
                      {proximosPacientes.map((consulta) => (
                        <div
                          key={consulta.id}
                          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {consulta.paciente?.nome || 'Paciente'}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {formatarDataHora(consulta.dataHoraInicio)} • {consulta.tipoConsulta?.nome}
                            </p>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link
                                  to="/consultas"
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-4 h-4" />
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to="/agendamento"
                                  className="flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                  Reagendar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <button
                                  className="w-full flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 text-sm rounded"
                                  onClick={() => cancelarConsulta(consulta.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Cancelar consulta
                                </button>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}

                      {/* Link para ver todas as consultas */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                        <Link to="/consultas">
                          <Button variant="outline" className="w-full" size="sm">
                            Ver todas as consultas
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        Nenhuma consulta agendada
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Motivational Card */}
              <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Excelente trabalho!
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Continue cuidando dos seus pacientes com dedicação e profissionalismo.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chart */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-600" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Estatísticas
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <DashboardGrafico refreshKey={graficoRefreshKey} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;