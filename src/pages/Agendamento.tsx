import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import Sidebar from "../components/common/Sidebar";
import { PacienteSelect } from "../components/common/PacienteSelect";
import { TipoConsultaSelect } from "../components/common/TipoConsultaSelect";
import { DataConsultaSelect } from "../components/common/DataConsultaSelect";
import { HorarioSelect } from "../components/common/HorarioSelect";
import { ObservacoesTextarea } from "../components/common/ObservacoesTextarea";
import api from "../services/api";
import type { Paciente } from "../types/Paciente";
import type { TipoConsulta } from "../types/TipoConsulta";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import "react-day-picker/dist/style.css";

const Agendamento: React.FC = () => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | undefined>();
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("");
  const [horariosDisponiveisRaw, setHorariosDisponiveisRaw] = useState<any[]>([]);
  const [observacoes, setObservacoes] = useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Função para buscar horários disponíveis
  const fetchHorariosDisponiveis = useCallback(async () => {
    try {
      const response = await api.get("/agenda/disponiveis");
      setHorariosDisponiveisRaw(response.data);
      const agrupado: Record<string, string[]> = response.data.reduce(
        (acc: Record<string, string[]>, item: any) => {
          if (!acc[item.data]) acc[item.data] = [];
          const hora = item.horaInicio.slice(0, 5);
          acc[item.data].push(hora);
          return acc;
        },
        {}
      );
      setHorariosDisponiveis(agrupado);
    } catch (error) {
      toast.error("Erro ao carregar horários disponíveis!");
    }
  }, []);

  // Dias disponíveis (Date[])
  const diasDisponiveis = Object.keys(horariosDisponiveis).map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  });

  // Dias indisponíveis (todos os dias do mês menos os disponíveis)
  const getDiasIndisponiveis = () => {
    if (!diasDisponiveis.length) return [];
    const ano = diasDisponiveis[0].getFullYear();
    const mes = diasDisponiveis[0].getMonth();
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const indisponiveis = [];
    for (let d = 1; d <= diasNoMes; d++) {
      const data = new Date(ano, mes, d);
      if (
        !diasDisponiveis.some(
          (disp) =>
            disp.getFullYear() === data.getFullYear() &&
            disp.getMonth() === data.getMonth() &&
            disp.getDate() === data.getDate()
        )
      ) {
        indisponiveis.push(data);
      }
    }
    return indisponiveis;
  };

  // Estilo customizado para dias disponíveis
  const modifiers = {
    available: diasDisponiveis,
    unavailable: getDiasIndisponiveis(),
    selected: dataSelecionada ? [dataSelecionada] : [],
  };
  
  const modifiersClassNames = {
    available: "rdp-day_available",
    unavailable: "rdp-day_unavailable",
    selected: "rdp-day_selected",
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [pacientesRes, tiposRes] = await Promise.all([
          api.get("/pacientes"),
          api.get("/tipos-consulta")
        ]);
        
        setPacientes(pacientesRes.data);
        setTiposConsulta(tiposRes.data);
        await fetchHorariosDisponiveis();
      } catch (error) {
        toast.error("Erro ao carregar dados!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchHorariosDisponiveis]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paciente || !tipoConsulta || !dataSelecionada || !horarioSelecionado) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsSubmitting(true);

    try {
      const dataISO = dataSelecionada.toISOString().slice(0, 10);
      const agendaObj = horariosDisponiveisRaw.find(
        (item) => 
          item.data === dataISO &&
          item.horaInicio.slice(0, 5) === horarioSelecionado
      );

      if (!agendaObj) {
        toast.error("Horário não encontrado!");
        return;
      }

      const payload = {
        pacienteId: paciente.id,
        tipoConsultaId: tipoConsulta.id,
        agendaDisponivelId: agendaObj.id,
        observacoes: observacoes,
      };

      await api.post("/consultas", payload);
      toast.success("Agendamento realizado com sucesso!");
      
      // Reset form
      setPaciente(null);
      setTipoConsulta(null);
      setDataSelecionada(undefined);
      setHorarioSelecionado("");
      setObservacoes("");
      await fetchHorariosDisponiveis();
    } catch (error) {
      toast.error("Erro ao agendar!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Carregando formulário...</p>
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
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Novo Agendamento
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Agende uma nova consulta para seu paciente
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex items-center gap-2 ${paciente ? 'text-cyan-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    paciente ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {paciente ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <span className="font-medium">Paciente</span>
                </div>
                
                <div className={`flex-1 h-0.5 mx-4 ${paciente ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                
                <div className={`flex items-center gap-2 ${tipoConsulta ? 'text-cyan-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    tipoConsulta ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {tipoConsulta ? <CheckCircle className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <span className="font-medium">Tipo</span>
                </div>
                
                <div className={`flex-1 h-0.5 mx-4 ${tipoConsulta ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                
                <div className={`flex items-center gap-2 ${dataSelecionada ? 'text-cyan-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    dataSelecionada ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {dataSelecionada ? <CheckCircle className="w-4 h-4" /> : <CalendarIcon className="w-4 h-4" />}
                  </div>
                  <span className="font-medium">Data</span>
                </div>
                
                <div className={`flex-1 h-0.5 mx-4 ${dataSelecionada ? 'bg-cyan-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                
                <div className={`flex items-center gap-2 ${horarioSelecionado ? 'text-cyan-600' : 'text-slate-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    horarioSelecionado ? 'bg-cyan-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
                  }`}>
                    {horarioSelecionado ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <span className="font-medium">Horário</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Dados do Agendamento
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PacienteSelect
                      pacientes={pacientes}
                      value={paciente}
                      onChange={setPaciente}
                    />
                    
                    <TipoConsultaSelect
                      tipos={tiposConsulta}
                      value={tipoConsulta}
                      onChange={setTipoConsulta}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DataConsultaSelect
                      diasDisponiveis={diasDisponiveis}
                      dataSelecionada={dataSelecionada}
                      onChange={setDataSelecionada}
                      modifiers={modifiers}
                      modifiersClassNames={modifiersClassNames}
                    />
                    
                    {dataSelecionada && (
                      <HorarioSelect
                        horarios={horariosDisponiveis[dataSelecionada.toISOString().slice(0, 10)] || []}
                        value={horarioSelecionado}
                        onChange={setHorarioSelecionado}
                        dataSelecionada={dataSelecionada}
                      />
                    )}
                  </div>

                  <ObservacoesTextarea
                    value={observacoes}
                    onChange={setObservacoes}
                  />

                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <Link to="/">
                      <Button variant="outline">
                        Cancelar
                      </Button>
                    </Link>
                    
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !paciente || !tipoConsulta || !dataSelecionada || !horarioSelecionado}
                      className="bg-cyan-600 hover:bg-cyan-700"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Agendando...
                        </>
                      ) : (
                        <>
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Agendar Consulta
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Agendamento;