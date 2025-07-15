import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import Sidebar from "../components/common/Sidebar";
import ConsultaAgendadaCard from "../components/common/ConsultaAgendadaCard";
import api from "../services/api";
import { formatarData } from "../utils/formatters";
import { usePagination } from "../hooks/usePagination";
import { exportarConsultasExcel } from "../utils/exportUtils";
import { DEFAULT_PAGE_SIZE, CONSULTA_STATUS } from "../constants";
import type { ConsultaResponse } from "../types/Consulta";
import {
  Calendar as CalendarIcon,
  Search,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download
} from "lucide-react";

const ConsultasAgendadas: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [consultas, setConsultas] = useState<ConsultaResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [dataFiltro, setDataFiltro] = useState<Date | undefined>();
  const [statusFiltro, setStatusFiltro] = useState<string>("agendadas");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  const exportarConsultas = () => {
    try {
      exportarConsultasExcel(consultasFiltradas, 'consultas_agendadas', true);
      toast.success("Consultas exportadas com sucesso!");
    } catch (error) {
      console.error('Erro ao exportar consultas:', error);
      toast.error("Erro ao exportar consultas!");
    }
  };

  const fetchConsultas = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/consultas");
      setConsultas(response.data);
    } catch (error) {
      toast.error("Erro ao carregar consultas!");
      console.error('Erro ao buscar consultas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const atualizarConsultas = useCallback(async () => {
    try {
      const response = await api.get("/consultas");
      setConsultas(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar consultas!");
    }
  }, []);

  useEffect(() => {
    fetchConsultas();
  }, [fetchConsultas]);

  // Filtros aplicados
  const consultasFiltradas = consultas.filter((consulta) => {
    // Filtro por data
    if (dataFiltro) {
      const consultaData = consulta.agendaDisponivel?.data;
      const filtroData = dataFiltro.toISOString().slice(0, 10);
      if (consultaData !== filtroData) return false;
    }

    // Filtro por status
    if (statusFiltro !== "todas") {
      if (statusFiltro === "agendadas" && consulta.dataConclusao !== null) return false;
      if (statusFiltro === "concluidas" && consulta.dataConclusao === null) return false;
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      const termo = searchTerm.toLowerCase();
      const nomeMatch = consulta.paciente?.nome?.toLowerCase().includes(termo);
      const tipoMatch = consulta.tipoConsulta?.nome?.toLowerCase().includes(termo);
      if (!nomeMatch && !tipoMatch) return false;
    }

    return true;
  });

  // Estatísticas
  const stats = {
    total: consultas.length,
    agendadas: consultas.filter(c => c.status === CONSULTA_STATUS.AGENDADA).length,
    concluidas: consultas.filter(c => c.status === CONSULTA_STATUS.CONCLUIDA).length,
    canceladas: consultas.filter(c => c.status === CONSULTA_STATUS.CANCELADA).length,
  };

  // Pagination
  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoNext,
    canGoPrevious,
  } = usePagination({
    totalItems: consultasFiltradas.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });

  const consultasPaginadas = paginatedItems(consultasFiltradas);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando consultas...</p>
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
                Consultas Agendadas
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gerencie todas as consultas da sua clínica
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportarConsultas}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>

              <Link to="/agendamento">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Consulta
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total de Consultas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.agendadas}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Agendadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.concluidas}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Concluídas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.canceladas}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Canceladas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por paciente ou tipo de consulta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600"
                  />
                </div>

                {/* Date Filter */}
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {dataFiltro ? formatarData(dataFiltro.toISOString()) : "Filtrar por data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="single"
                      selected={dataFiltro}
                      onSelect={(date) => {
                        setDataFiltro(date);
                        setCalendarOpen(false);
                      }}
                      initialFocus
                    />
                    {dataFiltro && (
                      <div className="p-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setDataFiltro(undefined);
                            setCalendarOpen(false);
                          }}
                          className="w-full"
                        >
                          Limpar filtro
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <select
                  value={statusFiltro}
                  onChange={(e) => setStatusFiltro(e.target.value)}
                  className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                >
                  <option value="todas">Todas</option>
                  <option value="agendadas">Agendadas</option>
                  <option value="concluidas">Concluídas</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Consultas List */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Lista de Consultas
                {consultasFiltradas.length !== consultas.length && (
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400 ml-2">
                    ({consultasFiltradas.length} de {consultas.length})
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {consultasPaginadas.length > 0 ? (
                <div className="space-y-4">
                  {consultasPaginadas.map((consulta) => (
                    <ConsultaAgendadaCard
                      key={consulta.id}
                      consulta={consulta}
                      atualizarConsultas={atualizarConsultas}
                    />
                  ))}
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Mostrando {((currentPage - 1) * DEFAULT_PAGE_SIZE) + 1} a {Math.min(currentPage * DEFAULT_PAGE_SIZE, consultasFiltradas.length)} de {consultasFiltradas.length} consultas
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToPreviousPage}
                          disabled={!canGoPrevious}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Anterior
                        </Button>
                        
                        <div className="flex items-center gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1;
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => goToPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={goToNextPage}
                          disabled={!canGoNext}
                        >
                          Próxima
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                    {searchTerm || dataFiltro || statusFiltro !== "todas" 
                      ? 'Nenhuma consulta encontrada' 
                      : 'Nenhuma consulta agendada'
                    }
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">
                    {searchTerm || dataFiltro || statusFiltro !== "todas"
                      ? 'Tente ajustar os filtros de busca.'
                      : 'Comece agendando sua primeira consulta.'
                    }
                  </p>
                  {!searchTerm && !dataFiltro && statusFiltro === "todas" && (
                    <Link to="/agendamento">
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Agendar Consulta
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ConsultasAgendadas;