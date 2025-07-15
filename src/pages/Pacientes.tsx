import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import Sidebar from "../components/common/Sidebar";
import CadastroPaciente from "../components/common/CadastroPaciente";
import EditarPaciente from "../components/common/EditarPaciente";
import api from "../services/api";
import { formatarData, formatarDataCadastro } from "../utils/formatters";
import { exportarPacientesExcel } from "../utils/exportUtils";
import { usePagination } from "../hooks/usePagination";
import { DEFAULT_PAGE_SIZE } from "../constants";
import type { PacienteResponse } from "../types/Paciente";
import {
  Users,
  Search,
  Plus,
  Calendar,
  Mail,
  Phone,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  Download
} from "lucide-react";

const Pacientes: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [pacientes, setPacientes] = useState<PacienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showCadastro, setShowCadastro] = useState<boolean>(false);
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<PacienteResponse | null>(null);
  const [pacienteParaEditar, setPacienteParaEditar] = useState<PacienteResponse | null>(null);
  const [excluindoPaciente, setExcluindoPaciente] = useState<boolean>(false);

  const fetchPacientes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/pacientes");
      setPacientes(response.data);
    } catch (error) {
      toast.error("Erro ao carregar pacientes!");
      console.error('Erro ao buscar pacientes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // Função para exportar pacientes
  const exportarPacientes = () => {
    exportarPacientesExcel(pacientesFiltrados);
  };

  const handlePacienteCadastrado = useCallback(() => {
    fetchPacientes();
    setShowCadastro(false);
    toast.success("Paciente cadastrado com sucesso!");
  }, [fetchPacientes]);

  const handleExcluirPaciente = useCallback(async () => {
    if (!pacienteParaExcluir) return;

    setExcluindoPaciente(true);
    try {
      await api.delete(`/pacientes/${pacienteParaExcluir.id}`);
      toast.success("Paciente excluído com sucesso!");
      setPacienteParaExcluir(null);
      fetchPacientes();
    } catch (error: any) {
      console.error('Erro ao excluir paciente:', error);
      toast.error(error.response?.data?.message || "Erro ao excluir paciente!");
    } finally {
      setExcluindoPaciente(false);
    }
  }, [pacienteParaExcluir, fetchPacientes]);

  // Filtrar pacientes por termo de busca
  const pacientesFiltrados = pacientes.filter((paciente) =>
    paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    paciente.telefone.includes(searchTerm)
  );

  // Estatísticas dos pacientes
  const stats = {
    total: pacientes.length,
    novosEsteAno: pacientes.filter(p => {
      const anoAtual = new Date().getFullYear();
      const anoCadastro = new Date(p.createdAt).getFullYear();
      return anoCadastro === anoAtual;
    }).length,
    comEmail: pacientes.filter(p => p.email && p.email.trim() !== '').length,
    comTelefone: pacientes.filter(p => p.telefone && p.telefone.trim() !== '').length
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
    totalItems: pacientesFiltrados.length,
    itemsPerPage: DEFAULT_PAGE_SIZE,
  });

  const pacientesPaginados = paginatedItems(pacientesFiltrados);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando pacientes...</p>
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
                Pacientes
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gerencie os pacientes da sua clínica
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={exportarPacientes}>
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>

              <Button
                onClick={() => setShowCadastro(!showCadastro)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showCadastro ? 'Cancelar' : 'Novo Paciente'}
              </Button>
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
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total de Pacientes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.novosEsteAno}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Novos este Ano
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.comEmail}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Com E-mail
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Phone className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.comTelefone}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Com Telefone
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search Bar */}
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Buscar:
                  </span>
                </div>
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Nome, e-mail ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                {searchTerm && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                  >
                    Limpar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cadastro de Paciente */}
            {showCadastro && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-600" />
                    Novo Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CadastroPaciente onPacienteCadastrado={handlePacienteCadastrado} />
                </CardContent>
              </Card>
            )}

            {/* Lista de Pacientes */}
            <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${showCadastro ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-600" />
                    Pacientes Cadastrados
                  </div>
                  <span className="text-sm font-normal text-slate-600 dark:text-slate-400">
                    {pacientesFiltrados.length} encontrado(s)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pacientesPaginados.length > 0 ? (
                  <div className="space-y-4">
                    {pacientesPaginados.map((paciente) => (
                      <div
                        key={paciente.id}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {paciente.nome}
                              </h3>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                              {paciente.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span>{paciente.email}</span>
                                </div>
                              )}
                              
                              {paciente.telefone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  <span>{paciente.telefone}</span>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Nascimento: {paciente.dataNascimento ? formatarData(paciente.dataNascimento) : 'Não informado'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <UserPlus className="w-4 h-4" />
                                <span>Cadastrado: {paciente.createdAt ? formatarDataCadastro(paciente.createdAt) : 'Não informado'}</span>
                              </div>
                            </div>
                            
                            {paciente.observacoes && (
                              <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm text-slate-600 dark:text-slate-400">
                                <strong>Observações:</strong> {paciente.observacoes}
                              </div>
                            )}
                          </div>
                          {/* Dropdown de ações */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => setPacienteParaEditar(paciente)}
                              >
                                <Edit className="w-4 h-4" />
                                Editar paciente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600"
                                onClick={() => setPacienteParaExcluir(paciente)}
                              >
                                <Trash2 className="w-4 h-4" />
                                Excluir paciente
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Mostrando {((currentPage - 1) * DEFAULT_PAGE_SIZE) + 1} a {Math.min(currentPage * DEFAULT_PAGE_SIZE, pacientesFiltrados.length)} de {pacientesFiltrados.length} pacientes
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
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {searchTerm 
                        ? 'Tente ajustar os termos da busca.' 
                        : 'Comece cadastrando seu primeiro paciente.'
                      }
                    </p>
                    {!searchTerm && (
                      <Button 
                        onClick={() => setShowCadastro(true)}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Cadastrar Primeiro Paciente
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={!!pacienteParaExcluir} onOpenChange={() => setPacienteParaExcluir(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o paciente <strong>{pacienteParaExcluir?.nome}</strong>?
              <br />
              <span className="text-red-600 text-sm mt-2 block">
                ⚠️ Esta ação não pode ser desfeita e todos os dados do paciente serão perdidos permanentemente.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPacienteParaExcluir(null)}
              disabled={excluindoPaciente}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleExcluirPaciente}
              disabled={excluindoPaciente}
            >
              {excluindoPaciente ? "Excluindo..." : "Sim, excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Componente de edição de paciente */}
      <EditarPaciente
        paciente={pacienteParaEditar}
        isOpen={!!pacienteParaEditar}
        onClose={() => setPacienteParaEditar(null)}
        onPacienteEditado={() => {
          fetchPacientes();
          setPacienteParaEditar(null);
        }}
      />
    </div>
  );
};

export default Pacientes;