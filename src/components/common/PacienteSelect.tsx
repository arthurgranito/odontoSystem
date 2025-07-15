import { useState } from "react";
import { Button } from "../ui/button";
import { Popover as PopoverUI, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Label } from "../ui/label";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import converteDataParaBR from "../../services/converteDataParaBR";
import calcularIdade from "../../services/calcularIdade";
import type { Paciente } from "../../types/Paciente";

interface PacienteSelectProps {
  pacientes: Paciente[];
  value: Paciente | null;
  onChange: (paciente: Paciente) => void;
}

export const PacienteSelect: React.FC<PacienteSelectProps> = ({ pacientes, value, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Label className="font-medium text-cyan-800 dark:text-cyan-100">Paciente</Label>
      <PopoverUI open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between hover:bg-white bg-white cursor-pointer"
          >
            {value ? value.nome : "Selecione uma opção"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full min-w-[var(--radix-popover-trigger-width)] p-0">
          <Command className="shadow-lg">
            <CommandInput placeholder="Buscar pelo nome..." />
            <CommandEmpty>Nenhuma opção encontrada.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {pacientes.map((pac) => {
                  const selecionado = value && value.id === pac.id;
                  return (
                    <CommandItem
                      key={pac.id}
                      value={`${pac.nome} - ${converteDataParaBR(pac.dataNascimento)} - ${calcularIdade(converteDataParaBR(pac.dataNascimento))}`}
                      onSelect={() => {
                        onChange(pac);
                        setOpen(false);
                      }}
                      className={cn(
                        "group flex flex-row items-center justify-between px-4 py-2 cursor-pointer w-full gap-4 mb-2",
                        selecionado
                          ? "bg-[#3aa6b9] text-white"
                          : "bg-white text-[#313131] hover:bg-[#3aa6b9] hover:text-white"
                      )}
                    >
                      <div className="flex flex-col items-start">
                        <span
                          className={
                            "font-medium text-base transition-colors duration-150 group-hover:text-white" +
                            (selecionado ? " text-white" : " text-[#313131]")
                          }
                        >
                          {pac.nome}
                        </span>
                        <span
                          className={
                            "text-xs ml-2 transition-colors duration-150 group-hover:text-white" +
                            (selecionado ? " text-white" : " text-[#313131]")
                          }
                        >
                          {converteDataParaBR(pac.dataNascimento)} · {calcularIdade(converteDataParaBR(pac.dataNascimento))} anos
                        </span>
                      </div>
                      {selecionado && <Check className="text-white" />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </PopoverUI>
    </div>
  );
}; 