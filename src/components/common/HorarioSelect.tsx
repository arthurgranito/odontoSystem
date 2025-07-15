import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";

interface HorarioSelectProps {
  horarios: string[];
  value: string;
  onChange: (horario: string) => void;
  dataSelecionada?: Date; // nova prop opcional
}

export const HorarioSelect: React.FC<HorarioSelectProps> = ({ horarios, value, onChange, dataSelecionada }) => {
  if (!horarios || horarios.length === 0) return null;
  // Ordena os horários em ordem crescente
  const horariosOrdenados = [...horarios].sort((a, b) => a.localeCompare(b));

  let horariosFiltrados = horariosOrdenados;
  if (dataSelecionada) {
    const hoje = new Date();
    const isHoje =
      dataSelecionada.getFullYear() === hoje.getFullYear() &&
      dataSelecionada.getMonth() === hoje.getMonth() &&
      dataSelecionada.getDate() === hoje.getDate();
    if (isHoje) {
      const horaAtual = hoje.getHours();
      const minAtual = hoje.getMinutes();
      horariosFiltrados = horariosOrdenados.filter((h) => {
        const [hH, hM] = h.split(":").map(Number);
        return hH > horaAtual || (hH === horaAtual && hM >= minAtual);
      });
    }
  }

  if (horariosFiltrados.length === 0) return (
    <div className="flex flex-col gap-2">
      <Label>Horário</Label>
      <div className="text-xs text-gray-500 dark:text-gray-400">Nenhum horário disponível para o restante do dia</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      <Label>Horário</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full mt-2">
          <SelectValue placeholder="Selecione um horário" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Todas as Escalas</SelectLabel>
            {horariosFiltrados.map((horario) => (
              <SelectItem key={horario} value={horario}>
                {horario}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}; 