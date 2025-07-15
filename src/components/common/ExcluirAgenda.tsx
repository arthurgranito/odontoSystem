import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useEffect, useState } from "react";
import formatarDataNascimento from "../../services/formataDataNascimento";
import converteDataParaISO from "../../services/converteDataParaISO";
import type { Escala } from "../../types/Escala";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { converterDiaSemana } from "../../services/converteDiaSemana";
import { converteHora } from "../../services/converteHora";
import { useAuth } from "../../hooks/useAuth";
interface ExcluirAgendaProps {
  onAgendaExcluida: () => void | Promise<void>;
}

const ExcluirAgenda = ({ onAgendaExcluida }: ExcluirAgendaProps) => {
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [escala, setEscala] = useState<Escala | null>(null);
  const [escalas, setEscalas] = useState<Escala[]>([]);
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchEscalas = async () => {
      try {
        const response = await api.get("/escalas");
        console.log(response.data);
        setEscalas(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar escalas!");
      }
    };

    fetchEscalas();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!authUser || !authUser.id) {
      toast.error("Usuário não autenticado!");
      return;
    }
    if (!escala || !escala.id) {
      toast.error("Selecione uma escala!");
      return;
    }
    if (dataInicio === "" || dataFinal === "") {
      toast.error("Preencha todos os campos!");
      return;
    }
    const agenda = {
      dentistaId: authUser.id,
      escalaId: escala.id,
      dataInicio: converteDataParaISO(dataInicio),
      dataFim: converteDataParaISO(dataFinal),
    };
    try {
      const response = await api.delete(`/agenda/excluir`, {
        data: agenda,
      });
      setDataFinal("");
      setDataInicio("");
      setEscala(null);
      if (
        response.data.horariosExcluidos == 0 &&
        response.data.consultasDesmarcadas == 0
      ) {
        toast.info("Nenhum horário encontrado no período!");
      } else {
        toast.success(`${response.data.horariosExcluidos} horários excluídos`);
      }
      console.log(response.data);
      if (onAgendaExcluida) await onAgendaExcluida();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Erro ao gerar agenda");
    }
  };

  return (
    <Card className="h-fit overflow-auto">
      <CardHeader>
        <CardTitle>Exclusão e Bloqueio de Agenda</CardTitle>
        <CardDescription>
          Preencha com as informações necessárias para excluir e bloquear a sua
          agenda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <Label>Data inicial</Label>
            <Input
              className="mt-2 text-sm"
              type="text"
              value={dataInicio}
              onChange={(e) =>
                setDataInicio(formatarDataNascimento(e.target.value))
              }
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
          </div>

          <div>
            <Label>Data final</Label>
            <Input
              className="mt-2 text-sm"
              type="text"
              value={dataFinal}
              onChange={(e) =>
                setDataFinal(formatarDataNascimento(e.target.value))
              }
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
          </div>

          <div>
            <Label>Escala</Label>
            <Select
              value={escala ? escala.id.toString() : ""}
              onValueChange={(id) => {
                const escalaSelecionada =
                  escalas.find((e) => e.id.toString() === id) || null;
                setEscala(escalaSelecionada);
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Selecione uma escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Todas as Escalas</SelectLabel>
                  {escalas.map((escala) => (
                    <SelectItem key={escala.id} value={escala.id.toString()}>
                      {converterDiaSemana(escala.diaSemana)} ·{" "}
                      {converteHora(escala.horaInicio)} -{" "}
                      {converteHora(escala.horaFim)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="destructive"
            className="cursor-pointer"
          >
            Excluir e bloquear
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExcluirAgenda;
