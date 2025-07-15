import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Sidebar from "../components/common/Sidebar";
import CadastroEscala from "../components/common/CadastroEscala";
import TodasEscalas from "../components/common/TodasEscalas";
import api from "../services/api";
import type { Escala } from "../types/Escala";
import { 
  Clock, 
  Calendar, 
  Plus, 
  Users,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const Escalas: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCadastro, setShowCadastro] = useState<boolean>(false);

  const fetchEscalas = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api.get("/escalas");
      setEscalas(response.data);
    } catch (error) {
      toast.error("Erro ao carregar as escalas!");
      console.error('Erro ao buscar escalas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEscalas();
  }, [fetchEscalas]);

  const handleEscalaCadastrada = useCallback(() => {
    fetchEscalas();
    setShowCadastro(false);
    toast.success("Escala cadastrada com sucesso!");
  }, [fetchEscalas]);

  // Estatísticas das escalas
  const stats = {
    total: escalas.length,
    ativas: escalas.filter(e => e.ativo).length,
    inativas: escalas.filter(e => !e.ativo).length,
    diasSemana: [...new Set(escalas.map(e => e.diaSemana))].length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando escalas...</p>
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
                Escalas de Trabalho
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gerencie os horários de funcionamento da clínica
              </p>
            </div>
            
            <Button 
              onClick={() => setShowCadastro(!showCadastro)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCadastro ? 'Cancelar' : 'Nova Escala'}
            </Button>
          </div>
        </div>

        <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total de Escalas
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
                      {stats.ativas}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Escalas Ativas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.inativas}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Escalas Inativas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.diasSemana}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Dias da Semana
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cadastro de Escala */}
            {showCadastro && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-600" />
                    Nova Escala
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CadastroEscala onEscalaCadastrada={handleEscalaCadastrada} />
                </CardContent>
              </Card>
            )}

            {/* Lista de Escalas */}
            <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${showCadastro ? '' : 'lg:col-span-2'}`}>
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-600" />
                  Escalas Cadastradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {escalas.length > 0 ? (
                  <TodasEscalas escalas={escalas} atualizarEscalas={fetchEscalas} />
                ) : (
                  <div className="text-center py-12">
                    <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Nenhuma escala cadastrada
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Comece criando sua primeira escala de trabalho.
                    </p>
                    <Button 
                      onClick={() => setShowCadastro(true)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Escala
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200 dark:border-cyan-800 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                    Sobre as Escalas de Trabalho
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>• As escalas definem os horários de funcionamento da clínica para cada dia da semana</p>
                    <p>• Apenas escalas ativas são consideradas para agendamentos</p>
                    <p>• Você pode ter múltiplas escalas para o mesmo dia (turnos diferentes)</p>
                    <p>• Os horários são utilizados para gerar a agenda disponível automaticamente</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Escalas;