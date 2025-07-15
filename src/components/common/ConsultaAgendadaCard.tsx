import {
  Check,
  CalendarDays,
  X,
  User,
  Clock,
  FileText,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { useState } from "react";
import converteDataParaBR from "../../services/converteDataParaBR";
import { converteHora } from "../../services/converteHora";
import api from "../../services/api";
import { toast } from "react-toastify";
import { PacienteSelect } from "./PacienteSelect";
import { TipoConsultaSelect } from "./TipoConsultaSelect";
import { DataConsultaSelect } from "./DataConsultaSelect";
import { HorarioSelect } from "./HorarioSelect";
import { ObservacoesTextarea } from "./ObservacoesTextarea";
import type { Paciente } from "../../types/Paciente";
import type { TipoConsulta } from "../../types/TipoConsulta";
import { useEffect } from "react";

interface ConsultaAgendadaCardProps {
  consulta: any;
  atualizarConsultas: () => Promise<void>;
}

const ConsultaAgendadaCard = ({
  consulta,
  atualizarConsultas,
}: ConsultaAgendadaCardProps) => {
  const [dialogType, setDialogType] = useState<null | {
    type: string;
    consulta: any;
  }>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [valorCobrado, setValorCobrado] = useState("");
  const [valorError, setValorError] = useState("");

  const concluir = async () => {
    if (consulta.status === "CANCELADA") {
      toast.error("Não é possível concluir uma consulta cancelada!");
      setDialogType(null);
      return;
    }
    if (
      !valorCobrado ||
      isNaN(Number(valorCobrado)) ||
      Number(valorCobrado) < 0
    ) {
      setValorError("Informe um valor válido.");
      return;
    }
    setValorError("");
    setActionLoading(true);
    try {
      await api.put(`/consultas/${consulta.id}`, {
        valorCobrado: Number(valorCobrado),
      });
      await api.put(`/consultas/${consulta.id}/concluir`);
      toast.success("Consulta concluída!");
      setDialogType(null);
      setValorCobrado("");
      await atualizarConsultas();
    } catch (Error) {
      console.error(Error);
      toast.error("Erro ao concluir consulta");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelar = async () => {
    setActionLoading(true);
    try {
      await api.put(`/consultas/${consulta.id}/cancelar`);
      toast.success("Consulta cancelada!");
      setDialogType(null);
      await atualizarConsultas();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cancelar consulta!");
    } finally {
      setActionLoading(false);
    }
  };

  const descancelar = async () => {
    setActionLoading(true);
    try {
      await api.put(`/consultas/${consulta.id}/descancelar`);
      toast.success("Consulta descancelada!");
      setDialogType(null);
      await atualizarConsultas();
    } catch (Error) {
      console.error(Error);
      toast.error("Erro ao desmarcar consulta!");
    } finally {
      setActionLoading(false);
    }
  };

  const desmarcar = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/consultas/${consulta.id}`);
      toast.success("Consulta desmarcada com sucesso!");
      setDialogType(null);
      atualizarConsultas();
    } catch (Error) {
      console.error(Error);
      toast.error("Erro ao desmarcar consulta!");
    } finally {
      setActionLoading(false);
    }
  };

  // Verificar se a consulta está concluída
  const isConsultaConcluida =
    consulta.status === "CONCLUIDA" || consulta.dataConclusao !== null;
  const isConsultaCancelada = consulta.status === "CANCELADA";

  return (
    <Card
      className={`rounded-2xl shadow-md border-0 transition hover:scale-[1.01] hover:shadow-lg ${
        isConsultaConcluida
          ? "bg-green-50/90 dark:bg-green-900/20 border-green-200 dark:border-green-800"
          : isConsultaCancelada
          ? "bg-red-50/90 dark:bg-red-900/20 border-red-200 dark:border-red-800"
          : "bg-white/90 dark:bg-zinc-900/80"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <User
              className={`w-5 h-5 ${
                isConsultaConcluida
                  ? "text-green-600"
                  : isConsultaCancelada
                  ? "text-red-600"
                  : "text-cyan-600"
              }`}
            />
            <CardTitle
              className={`text-lg font-bold font-poppins ${
                isConsultaConcluida
                  ? "text-green-900 dark:text-green-100"
                  : isConsultaCancelada
                  ? "text-red-900 dark:text-red-100"
                  : "text-cyan-900 dark:text-cyan-100"
              }`}
            >
              {consulta.paciente?.nome}
            </CardTitle>
            {isConsultaConcluida && (
              <Badge className="bg-green-600 text-white rounded-xl px-2 py-1 text-xs">
                Concluída
              </Badge>
            )}
            {isConsultaCancelada && (
              <Badge className="bg-red-600 text-white rounded-xl px-2 py-1 text-xs">
                Cancelada
              </Badge>
            )}
          </div>
          <CardDescription
            className={
              isConsultaConcluida
                ? "text-green-700 dark:text-green-300"
                : isConsultaCancelada
                ? "text-red-700 dark:text-red-300"
                : ""
            }
          >
            Email: {consulta.paciente?.email}
          </CardDescription>
          <CardDescription
            className={
              isConsultaConcluida
                ? "text-green-700 dark:text-green-300"
                : isConsultaCancelada
                ? "text-red-700 dark:text-red-300"
                : ""
            }
          >
            Telefone: {consulta.paciente?.telefone}
          </CardDescription>
        </div>
        <Badge
          className={`rounded-xl px-3 py-1 text-xs font-poppins ${
            isConsultaConcluida
              ? "bg-green-600 text-white"
              : isConsultaCancelada
              ? "bg-red-600 text-white"
              : "bg-cyan-600 text-white"
          }`}
        >
          {consulta.tipoConsulta?.nome}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div
          className={`flex items-center gap-4 text-sm font-poppins ${
            isConsultaConcluida
              ? "text-green-800 dark:text-green-200"
              : isConsultaCancelada
              ? "text-red-800 dark:text-red-200"
              : "text-cyan-800 dark:text-cyan-200"
          }`}
        >
          <span className="flex items-center gap-1 justify-center">
            <CalendarDays className="w-4 h-4" />
            {converteDataParaBR(
              consulta.agendaDisponivel?.data ||
                consulta.dataHoraInicio?.split("T")[0]
            )}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {converteHora(
              consulta.dataHoraInicio?.split("T")[1] ||
                consulta.agendaDisponivel?.horaInicio
            )}
          </span>
        </div>

        {/* Mostrar valor cobrado se a consulta foi concluída */}
        {isConsultaConcluida && consulta.valorCobrado && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium">
            <span>💰 Valor cobrado: R$ {consulta.valorCobrado.toFixed(2)}</span>
          </div>
        )}

        {/* Mostrar data de conclusão se disponível */}
        {isConsultaConcluida && consulta.dataConclusao && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xs">
            <CheckCircle className="w-4 h-4" />
            Concluída em:{" "}
            {converteDataParaBR(consulta.dataConclusao.split("T")[0])}
          </div>
        )}

        {consulta.observacoes && (
          <div
            className={`flex items-center gap-2 text-xs mt-1 ${
              isConsultaConcluida
                ? "text-green-500 dark:text-green-300"
                : isConsultaCancelada
                ? "text-red-500 dark:text-red-300"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            <FileText className="w-4 h-4" />
            {consulta.observacoes}
          </div>
        )}

        {/* Botões de ação - apenas para consultas não concluídas */}
        {!isConsultaConcluida && (
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Botão Concluir - apenas para consultas agendadas */}
            {!isConsultaCancelada && (
              <Dialog
                open={dialogType?.type === "concluir"}
                onOpenChange={(open) => {
                  if (!open) {
                    setDialogType(null);
                    setValorCobrado("");
                    setValorError("");
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="font-poppins cursor-pointer bg-[#3aa6b9] text-white hover:bg-[#3293a3] transition"
                    title="Concluir consulta"
                    onClick={() =>
                      setDialogType({ type: "concluir", consulta })
                    }
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Concluir
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Concluir consulta</DialogTitle>
                    <DialogDescription>
                      Informe o valor cobrado para esta consulta antes de
                      concluir.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-2 mt-2">
                    <label className="text-sm font-medium">
                      Valor cobrado (R$)
                    </label>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={valorCobrado}
                      onChange={(e) => setValorCobrado(e.target.value)}
                      placeholder="Ex: 150.00"
                      className="w-full"
                    />
                    {valorError && (
                      <span className="text-red-500 text-xs">{valorError}</span>
                    )}
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-200"
                      >
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      variant="default"
                      onClick={concluir}
                      className="cursor-pointer"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Concluindo..." : "Confirmar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {/* Botão Reagendar - apenas para consultas não canceladas */}
            {!isConsultaCancelada && (
              <Dialog
                open={dialogType?.type === "reagendar"}
                onOpenChange={(open) => {
                  if (!open) {
                    setDialogType(null);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="font-poppins cursor-pointer hover:bg-gray-200"
                    title="Reagendar consulta"
                    onClick={() =>
                      setDialogType({ type: "reagendar", consulta })
                    }
                  >
                    <CalendarDays className="w-4 h-4 mr-1" />
                    Reagendar
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Reagendar Consulta</DialogTitle>
                    <DialogDescription>
                      Altere os dados abaixo para reagendar esta consulta.
                    </DialogDescription>
                  </DialogHeader>
                  <ReagendarForm
                    consulta={consulta}
                    onClose={() => setDialogType(null)}
                    atualizarConsultas={atualizarConsultas}
                  />
                </DialogContent>
              </Dialog>
            )}

            {/* Botão Desmarcar - apenas para consultas agendadas */}
            {!isConsultaCancelada && (
              <Button
                size="sm"
                variant="outline"
                className="font-poppins cursor-pointer hover:bg-red-50 text-red-600 border-red-200"
                title="Desmarcar consulta"
                onClick={desmarcar}
                disabled={actionLoading}
              >
                <X className="w-4 h-4 mr-1" />
                {actionLoading ? "Desmarcando..." : "Desmarcar"}
              </Button>
            )}

            {/* Botão Cancelar/Descancelar */}
            <Dialog
              open={
                dialogType?.type === "cancelar" ||
                dialogType?.type === "descancelar"
              }
              onOpenChange={(open) => !open && setDialogType(null)}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive"
                  className="font-poppins cursor-pointer"
                  title={
                    consulta.status === "CANCELADA"
                      ? "Descancelar consulta"
                      : "Cancelar consulta"
                  }
                  onClick={() =>
                    setDialogType({
                      type:
                        consulta.status === "CANCELADA"
                          ? "descancelar"
                          : "cancelar",
                      consulta,
                    })
                  }
                >
                  <X className="w-4 h-4 mr-1" />
                  {consulta.status === "CANCELADA" ? "Descancelar" : "Cancelar"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {consulta.status === "CANCELADA"
                      ? "Descancelar consulta"
                      : "Cancelar consulta"}
                  </DialogTitle>
                  <DialogDescription>
                    {consulta.status === "CANCELADA"
                      ? "Tem certeza que deseja descancelar esta consulta?"
                      : "Tem certeza que deseja cancelar esta consulta?"}
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-200"
                    >
                      Não
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={
                      consulta.status === "CANCELADA" ? descancelar : cancelar
                    }
                    className="cursor-pointer"
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? consulta.status === "CANCELADA"
                        ? "Descancelando..."
                        : "Cancelando..."
                      : consulta.status === "CANCELADA"
                      ? "Sim, descancelar"
                      : "Sim, cancelar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* Mensagem para consultas concluídas */}
        {isConsultaConcluida && (
          <div className="mt-3 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">
                Consulta realizada com sucesso!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente ReagendarForm
function ReagendarForm({
  consulta,
  onClose,
  atualizarConsultas,
}: {
  consulta: any;
  onClose: () => void;
  atualizarConsultas: () => Promise<void>;
}) {
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [tipoConsulta, setTipoConsulta] = useState<TipoConsulta | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [tiposConsulta, setTiposConsulta] = useState<TipoConsulta[]>([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<
    Record<string, string[]>
  >({});
  const [horariosDisponiveisRaw, setHorariosDisponiveisRaw] = useState<any[]>(
    []
  );

  const fetchHorariosDisponiveis = async () => {
    try {
      const response = await api.get("/agenda/disponiveis");
      console.log("Horários disponíveis RAW:", response.data); // Debug
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

      console.log("Horários agrupados:", agrupado); // Debug
      console.log("Datas disponíveis:", Object.keys(agrupado)); // Debug
      setHorariosDisponiveis(agrupado);
    } catch (error) {
      console.error("Erro ao buscar horários:", error);
    }
  };

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        const response = await api.get("/pacientes");
        setPacientes(response.data);
      } catch {}
    };
    const fetchTiposConsulta = async () => {
      try {
        const response = await api.get("/tipos-consulta");
        setTiposConsulta(response.data);
      } catch {}
    };

    fetchPacientes();
    fetchTiposConsulta();
    fetchHorariosDisponiveis();
  }, []);

  const diasDisponiveis = Object.keys(horariosDisponiveis).map((dateStr) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    console.log(`Convertendo ${dateStr} para:`, date); // Debug
    return date;
  });

  console.log("Dias disponíveis calculados:", diasDisponiveis); // Debug

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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!paciente || !tipoConsulta || !dataSelecionada || !horarioSelecionado) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
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
      paciente: paciente,
      tipoConsulta: tipoConsulta,
      agendaDisponivel: agendaObj,
      observacoes: observacoes,
    };
    setLoading(true);
    try {
      await api.put(`/consultas/${consulta.id}/reagendar`, payload);
      toast.success("Consulta reagendada com sucesso!");
      onClose();
      await fetchHorariosDisponiveis();
      await atualizarConsultas();
    } catch {
      toast.error("Erro ao reagendar!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4 mt-2" onSubmit={handleSubmit}>
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
      <DataConsultaSelect
        diasDisponiveis={diasDisponiveis}
        dataSelecionada={dataSelecionada ?? undefined}
        onChange={(date: Date | undefined) => setDataSelecionada(date ?? null)}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
      />
      {dataSelecionada &&
        (() => {
          const dataISO = dataSelecionada.toISOString().slice(0, 10);
          const horariosDisponiveisNoDia = horariosDisponiveis[dataISO] || [];
          return (
            <HorarioSelect
              horarios={horariosDisponiveisNoDia}
              value={horarioSelecionado}
              onChange={setHorarioSelecionado}
            />
          );
        })()}
      <ObservacoesTextarea value={observacoes} onChange={setObservacoes} />
      <div className="flex justify-end gap-2 mt-2">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer hover:bg-gray-200"
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" className="cursor-pointer" disabled={loading}>
          {loading ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}

export default ConsultaAgendadaCard;
