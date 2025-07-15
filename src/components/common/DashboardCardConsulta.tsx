import { Check, Trash } from "lucide-react";
import api from "../../services/api";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { toast } from "react-toastify";
import { converteHora } from "../../services/converteHora";

interface Props {
  consulta: any;
  atualizarConsultas: () => void;
  atualizarGrafico?: () => void;
}

const DashboardCardConsulta = ({ consulta, atualizarConsultas, atualizarGrafico }: Props) => {
  const [dialogType, setDialogType] = useState<null | {
    type: string;
    consulta: any;
  }>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [valorCobrado, setValorCobrado] = useState("");
  const [valorError, setValorError] = useState("");

  const nomePaciente = consulta.paciente.nome;
  const horaInicio = converteHora(consulta.agendaDisponivel.horaInicio);
  const tipoConsulta = consulta.tipoConsulta.nome;

  const concluir = async () => {
    if (consulta.status === "CANCELADA") {
      toast.error("Não é possível concluir uma consulta cancelada!");
      setDialogType(null);
      return;
    }
    if (!valorCobrado || isNaN(Number(valorCobrado))) {
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
      atualizarConsultas();
      if (atualizarGrafico) atualizarGrafico();
    } catch (Error) {
      console.error(Error);
      toast.error("Erro ao concluir consulta");
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

  return (
    <div className="bg-cyan-50 dark:bg-cyan-950/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 shadow-sm">
      <div>
        <span className="font-medium text-cyan-800 dark:text-cyan-100">
          {nomePaciente}
        </span>
        <span className="ml-2 text-xs text-gray-500">{horaInicio}</span>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300">
        Tipo: {tipoConsulta}
      </div>
      <div className="flex gap-2">
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
              onClick={() => setDialogType({ type: "concluir", consulta })}
            >
              <Check className="w-4 h-4 mr-1" />
              Concluir
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Concluir consulta</DialogTitle>
              <DialogDescription>
                Informe o valor cobrado para esta consulta antes de concluir.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-sm font-medium">Valor cobrado (R$)</label>
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
                  className="hover:bg-gray-200 cursor-pointer"
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

        <Dialog
          open={dialogType?.type === "cancelar"}
          onOpenChange={(open) => !open && setDialogType(null)}
        >
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="font-poppins cursor-pointer text-red-500 hover:bg-gray-200 hover:text-red-500"
              title={"Cancelar Consulta"}
              onClick={() =>
                setDialogType({
                  type: "cancelar",
                  consulta,
                })
              }
            >
              <Trash className="w-4 h-4 mr-1" />
              Desmarcar
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Desmarcar consulta?</DialogTitle>
              <DialogDescription className="text-red-500">
                Atenção! Essa ação é irreversível!
              </DialogDescription>
            </DialogHeader>
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
                variant="destructive"
                onClick={desmarcar}
                disabled={actionLoading}
                className="cursor-pointer"
              >
                {actionLoading ? "Desmarcando..." : "Confirmar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardCardConsulta;
