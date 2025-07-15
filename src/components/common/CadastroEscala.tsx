import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
import { HoraInput } from "./HoraInput";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface CadastroEscalaProps {
  onEscalaCadastrada: () => void | Promise<void>;
}

const CadastroEscala = ({ onEscalaCadastrada }: CadastroEscalaProps) => {
  const [diaSemana, setDiaSemana] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFinal, setHoraFinal] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("");
  const { user } = useAuth();

  function toLocalTime(hora: string) {
    if (hora.length === 8) return hora;
    return hora + ":00";
  }

  const horaParaMinutos = (hora: string) => {
    const [h, m] = hora.split(":").map(Number);
    return h * 60 + m;
  };

  function normalizaHora(hora: string): string {
    if (/^\d{1,2}$/.test(hora)) {
      return hora.padStart(2, "0") + ":00";
    }
    return hora;
  }

  function horaValida(hora: string): boolean {
    const normalizada = normalizaHora(hora);
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(normalizada);
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const horaInicioNormalizada = normalizaHora(horaInicio);
    const horaFinalNormalizada = normalizaHora(horaFinal);
    if (
      diaSemana == "" ||
      horaInicio == "" ||
      horaFinal == "" ||
      duracaoMinutos == ""
    ) {
      toast.error("Preencha todos os campos!");
    } else if (
      !horaValida(horaInicioNormalizada) ||
      !horaValida(horaFinalNormalizada)
    ) {
      toast.error("Horário deve estar entre 00:00 e 23:59!");
    } else if (
      horaParaMinutos(horaFinalNormalizada) <=
      horaParaMinutos(horaInicioNormalizada)
    ) {
      toast.error("A hora final deve ser maior que a hora inicial!");
    } else {
      const escala = {
        diaSemana: diaSemana,
        horaInicio: toLocalTime(horaInicioNormalizada),
        horaFim: toLocalTime(horaFinalNormalizada),
        intervaloMinutos: duracaoMinutos,
        dentista: user,
      };
      try {
        await api.post("/escalas", escala);
        setDiaSemana("");
        setHoraInicio("");
        setHoraFinal("");
        setDuracaoMinutos("");
        toast.success("Escala cadastrada com sucesso!");
        if (onEscalaCadastrada) await onEscalaCadastrada();
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cadastrar escala!");
      }
    }
  };

  return (
    <Card className="h-fit overflow-auto">
      <CardHeader>
        <CardTitle>Cadastro de Escalas</CardTitle>
        <CardDescription>
          Preencha com as informações necessárias para criar a sua escala
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                  <SelectItem value="SEGUNDA_FEIRA">Segunda-feira</SelectItem>
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
            <HoraInput
              value={horaInicio}
              onChange={setHoraInicio}
            />
          </div>

          <div>
            <Label>Hora final</Label>
            <HoraInput value={horaFinal} onChange={setHoraFinal} />
          </div>

          <div>
            <Label>Duração do atendimento</Label>
            <Input
              className="mt-2 text-sm"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(e.target.value)}
              placeholder="Duração em minutos"
            />
          </div>

          <Button className="cursor-pointer" type="submit">
            Cadastrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CadastroEscala;
