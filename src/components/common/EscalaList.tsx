import { Trash } from "lucide-react";
import type { Escala } from "../../types/Escala";
import { TooltipProvider } from "../ui/tooltip";
import { converterDiaSemana } from "../../services/converteDiaSemana";
import { converteHora } from "../../services/converteHora";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useState } from "react";
import { HoraInput } from "./HoraInput";
import { Input } from "../ui/input";
import api from "../../services/api";
import { toast } from "react-toastify";

interface Props {
  escala: Escala;
  deletarEscala: () => void | Promise<void>;
  atualizar: () => void | Promise<void>;
}

const EscalaList = ({ escala, deletarEscala, atualizar }: Props) => {
  const horaInicioFormatada = escala.horaInicio.split(":");
  const horaFimFormatada = escala.horaFim.split(":");

  const [diaSemana, setDiaSemana] = useState(escala.diaSemana);
  const [horaInicio, setHoraInicio] = useState(
    `${horaInicioFormatada[0]}:${horaInicioFormatada[1]}`
  );
  const [horaFim, setHoraFim] = useState(
    `${horaFimFormatada[0]}:${horaFimFormatada[1]}`
  );
  const [intervaloMinutos, setIntervaloMinutos] = useState(
    Number(escala.intervaloMinutos)
  );

  const toLocalTime = (hora: string) => {
    if (hora.length === 8) return hora;
    return hora + ":00";
  };

  const horaParaMinutos = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  const normalizaHora = (hora: string): string => {
    if (/^\d{1,2}$/.test(hora)) {
      return hora.padStart(2, "0") + ":00";
    }
    return hora;
  };

  const horaValida = (hora: string): boolean => {
    const normalizada = normalizaHora(hora);
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(normalizada);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const horaInicioFormalizada = normalizaHora(horaInicio);
    const horaFinalFormalizada = normalizaHora(horaFim);
    if (
      diaSemana == "" ||
      horaInicio == "" ||
      horaFim == "" ||
      intervaloMinutos == null
    ) {
      toast.error("Preencha todos os campos!");
    } else if (
      !horaValida(horaInicioFormalizada) ||
      !horaValida(horaFinalFormalizada)
    ) {
      toast.error("Horário deve estar entre 00:00 e 23:59!");
    } else if (
      horaParaMinutos(horaFinalFormalizada) <=
      horaParaMinutos(horaInicioFormalizada)
    ) {
      toast.error("A hora final deve ser maior que a hora inicial!");
    } else {
      const escalaAtualizada = {
        id: escala.id,
        diaSemana: diaSemana,
        horaInicio: toLocalTime(horaInicioFormalizada),
        horaFim: toLocalTime(horaFinalFormalizada),
        intervaloMinutos: intervaloMinutos,
      };
      try {
        await api.put(`/escalas/${escala.id}`, escalaAtualizada);
        atualizar();
        toast.success("Escala atualizada com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar escala!");
      }
    }
  };

  return (
    <TooltipProvider key={escala.id}>
      <div className="flex flex-row items-center w-full mt-4 cursor-pointer overflow-hidden rounded-2xl p-4 mb-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <Dialog>
          <DialogTrigger asChild>
            <figure>
              <div className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl">
                  <span className="text-2xl">🗓️</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                    <span className="text-sm sm:text-lg">
                      {converterDiaSemana(escala.diaSemana)}
                    </span>
                    <span className="mx-1">·</span>
                    <span className="text-xs text-gray-500">
                      {converteHora(escala.horaInicio)} -{" "}
                      {converteHora(escala.horaFim)}
                    </span>
                  </figcaption>
                  <p className="text-sm font-normal dark:text-white">
                    Atendimentos a cada {escala.intervaloMinutos} minutos
                  </p>
                </div>
              </div>
            </figure>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar escala</DialogTitle>
              <DialogDescription>
                Edite os dados da sua escala
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="diaSemana">Dia da semana</Label>
                <Select value={diaSemana} onValueChange={setDiaSemana}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Selecione um dia da semana" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Dias da semana</SelectLabel>
                      <SelectItem value="SEGUNDA_FEIRA">
                        Segunda-feira
                      </SelectItem>
                      <SelectItem value="TERCA_FEIRA">Terça-feira</SelectItem>
                      <SelectItem value="QUARTA_FEIRA">Quarta-feira</SelectItem>
                      <SelectItem value="QUINTA_FEIRA">Quinta-feira</SelectItem>
                      <SelectItem value="SEXTA_FEIRA">Sexta-feira</SelectItem>
                      <SelectItem value="SABADO">Sábado</SelectItem>
                      <SelectItem value="DOMINGO">Domingo</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Hora de início</Label>
                <HoraInput value={horaInicio} onChange={setHoraInicio} />
              </div>
              <div>
                <Label>Hora final</Label>
                <HoraInput value={horaFim} onChange={setHoraFim} />
              </div>
              <div>
                <Label>Duração do atendimento</Label>
                <Input
                  className="mt-2 text-sm"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={intervaloMinutos}
                  onChange={(e) => setIntervaloMinutos(Number(e.target.value))}
                  placeholder="Duração em minutos"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <DialogClose asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button className="cursor-pointer" type="submit">
                    Cadastrar
                  </Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div className="ml-auto flex items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" variant="destructive">
                <Trash />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deseja excluir esta escala?</DialogTitle>
                <DialogDescription>
                  Atenção! Este processo é irreversível
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <DialogClose asChild>
                  <Button variant="destructive" className="cursor-pointer">
                    Cancelar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={deletarEscala} className="cursor-pointer">
                    Deletar
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default EscalaList;
