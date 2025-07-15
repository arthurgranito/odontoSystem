import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Sidebar from "../components/common/Sidebar";
import CadastroTipoConsulta from "../components/common/CadastroTipoConsulta";
import TodosTiposConsulta from "../components/common/TodosTiposConsulta";
import api from "../services/api";
import type { TipoConsulta } from "../types/TipoConsulta";
import { 
  Tags, 
  Plus, 
  DollarSign, 
  Clock,
  Settings,
  AlertCircle,
  CheckCircle
} from "lucide-react";

const TiposConsulta: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCadastro, setShowCadastro] = useState<boolean>(false);

  const fetchTiposConsulta = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/tipos-consulta");
      setTiposConsulta(response.data);
    } catch (error) {
      toast.error("Erro ao carregar os tipos de consulta!");
      console.error('Erro ao buscar tipos de consulta:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTiposConsulta();
  }, [fetchTiposConsulta]);

  const handleTipoCadastrado = useCallback(() => {
    fetchTiposConsulta();
    setShowCadastro(false);
    toast.success("Tipo de consulta cadastrado com sucesso!");
  }, [fetchTiposConsulta]);

  // Estatísticas dos tipos de consulta
  const stats = {
    total: tiposConsulta.length,
    valorMedio: tiposConsulta.length > 0
      ? tiposConsulta.reduce((acc, tipo) => acc + (tipo.preco || 0), 0) / tiposConsulta.length
      : 0,
    maiorValor: Math.max(...tiposConsulta.map(t => t.preco || 0), 0),
    menorValor: tiposConsulta.length > 0
      ? Math.min(...tiposConsulta.map(t => t.preco || 0).filter(v => v > 0))
      : 0
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando tipos de consulta...</p>
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
                Tipos de Consulta
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                Gerencie os procedimentos e valores da sua clínica
              </p>
            </div>
            
            <Button 
              onClick={() => setShowCadastro(!showCadastro)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showCadastro ? 'Cancelar' : 'Novo Tipo'}
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
                    <Tags className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.total}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Tipos Cadastrados
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.valorMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Valor Médio
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.maiorValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Maior Valor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {stats.menorValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Menor Valor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cadastro de Tipo de Consulta */}
            {showCadastro && (
              <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-cyan-600" />
                    Novo Tipo de Consulta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CadastroTipoConsulta onTipoCadastrado={handleTipoCadastrado} />
                </CardContent>
              </Card>
            )}

            {/* Lista de Tipos de Consulta */}
            <Card className={`bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${showCadastro ? '' : 'lg:col-span-2'}`}>
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-600" />
                  Tipos Cadastrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tiposConsulta.length > 0 ? (
                  <TodosTiposConsulta 
                    atualizarTiposConsulta={fetchTiposConsulta} 
                    tiposConsulta={tiposConsulta} 
                  />
                ) : (
                  <div className="text-center py-12">
                    <Tags className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Nenhum tipo de consulta cadastrado
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Comece criando seu primeiro tipo de consulta.
                    </p>
                    <Button 
                      onClick={() => setShowCadastro(true)}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeiro Tipo
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
                    Sobre os Tipos de Consulta
                  </h3>
                  <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    <p>• Os tipos de consulta definem os procedimentos oferecidos pela clínica</p>
                    <p>• Cada tipo possui um valor e duração estimada</p>
                    <p>• Estes dados são utilizados no agendamento e faturamento</p>
                    <p>• Você pode editar ou excluir tipos existentes conforme necessário</p>
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

export default TiposConsulta;