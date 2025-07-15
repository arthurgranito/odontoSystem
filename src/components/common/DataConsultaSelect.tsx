import { useState } from "react";
import { Button } from "../ui/button";
import { Popover as PopoverUI, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";

interface DataConsultaSelectProps {
  diasDisponiveis: Date[];
  dataSelecionada: Date | undefined;
  onChange: (date: Date) => void;
  modifiers: any;
  modifiersClassNames: any;
}

export const DataConsultaSelect: React.FC<DataConsultaSelectProps> = ({ diasDisponiveis, dataSelecionada, onChange, modifiers, modifiersClassNames }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <Label>Data da consulta</Label>
      <PopoverUI open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            className="w-full flex items-center justify-between border border-gray-300 bg-white dark:bg-zinc-900/80 px-4 py-2 text-sm text-[#313131] dark:text-cyan-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-600 hover:bg-transparent cursor-pointer"
          >
            {dataSelecionada
              ? dataSelecionada.toLocaleDateString("pt-BR")
              : "Selecione a data"}
            <CalendarIcon className="ml-2 h-5 w-5 text-cyan-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-60 h-auto p-0 mt-1 bg-white dark:bg-zinc-900/80 text-[#313131] dark:text-cyan-100">
          <Calendar
            mode="single"
            selected={dataSelecionada}
            onSelect={(date) => {
              if (date) onChange(date);
              setOpen(false);
            }}
            disabled={(date) =>
              !diasDisponiveis.some(
                (d: Date) =>
                  d.getFullYear() == date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
              )
            }
            captionLayout="dropdown"
            modifiers={modifiers}
            modifiersClassNames={modifiersClassNames}
            className="text-sm p-2 rounded-md shadow-md bg-white dark:bg-zinc-900/80 text-[#313131] dark:text-cyan-100"
          />
          <style>{`
            .rdp {
                font-size: 12px;
                width: 360px;
                max-width: 100%;
                padding: 4px;
                box-sizing: border-box;
            }

            .rdp-table {
                border-spacing: 0px;
                width: 100%;
            }
            .rdp-day {
                width: 28px;
                height: 28px;
                padding: 0;
                margin: 2px;
                line-height: 28px;
                text-align: center;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .rdp-day_available {
                background-color: #3aa6b9 !important;
                color: #fff !important;
                font-weight: normal !important;
                border: none !important;
            }
            .rdp-day_selected.rdp-day_available {
                background-color: #3aa6b9 !important;
                color: #fff !important;
                font-weight: bold !important;
                border: none !important;
            }
            .rdp-day_unavailable {
                background-color: #ff7a7a !important;
                color: #fff !important;
                font-weight: normal !important;
                border: none !important;
                opacity: 1 !important;
            }
          `}</style>
        </PopoverContent>
      </PopoverUI>
    </div>
  );
}; 