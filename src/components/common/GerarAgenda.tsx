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

interface GerarAgendaProps {
  onAgendaGerada: () => void | Promise<void>;
  user: any
}

const GerarAgenda = ({ onAgendaGerada, user }: GerarAgendaProps) => {
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

  // Função para criar Date a partir de yyyy-MM-dd
  function parseISODate(str: string) {
    if (!str) return new Date('');
    const [year, month, day] = str.split('-');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

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
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    const inicio = parseISODate(converteDataParaISO(dataInicio) || "");
    const fim = parseISODate(converteDataParaISO(dataFinal) || "");
    inicio.setHours(0,0,0,0);
    fim.setHours(0,0,0,0);
    if (fim < inicio) {
      toast.error("A data final não pode ser antes da data inicial!");
      return;
    }
    if (inicio < hoje || fim < hoje) {
      toast.error("As datas não podem ser anteriores à data atual!");
      return;
    }
    const agenda = {
      dentistaId: authUser.id,
      escalaId: escala.id,
      dataInicio: converteDataParaISO(dataInicio),
      dataFim: converteDataParaISO(dataFinal),
    };
    try {
      await api.post("/agenda/gerar", agenda);
      setDataFinal("");
      setDataInicio("");
      setEscala(null);
      toast.success("Agenda gerada com sucesso!");
      if (onAgendaGerada) await onAgendaGerada();
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.error || "Erro ao gerar agenda");
    }
  };

  return (
    <Card className="h-fit overflow-auto">
      <CardHeader>
        <CardTitle>Geração e Liberação de Agenda</CardTitle>
        <CardDescription>
          Preencha com as informações necessárias para gerar e liberar a sua
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
              onChange={e => setDataInicio(formatarDataNascimento(e.target.value))}
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
              onChange={e => setDataFinal(formatarDataNascimento(e.target.value))}
              placeholder="dd/mm/aaaa"
              maxLength={10}
            />
          </div>
          <div>
            <Label>Escala</Label>
            <Select
              value={escala ? escala.id.toString() : ""}
              onValueChange={id => {
                const escalaSelecionada = escalas.find(e => e.id.toString() === id) || null;
                setEscala(escalaSelecionada);
              }}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Selecione uma escala" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Todas as Escalas</SelectLabel>
                  {escalas.map(escala => (
                    <SelectItem key={escala.id} value={escala.id.toString()}>
                      {converterDiaSemana(escala.diaSemana)} · {converteHora(escala.horaInicio)} - {converteHora(escala.horaFim)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="cursor-pointer" type="submit">
            Gerar e Liberar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GerarAgenda;
