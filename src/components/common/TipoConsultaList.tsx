import { Trash } from "lucide-react";
import { TooltipProvider } from "../ui/tooltip";
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
import { useState } from "react";
import { Input } from "../ui/input";
import api from "../../services/api";
import { toast } from "react-toastify";
import type { TipoConsulta } from "../../types/TipoConsulta";

interface Props {
  tipoConsulta: TipoConsulta;
  deletarTipoConsulta: () => void | Promise<void>;
  atualizar: () => void | Promise<void>;
}

const TipoConsultaList = ({
  tipoConsulta,
  deletarTipoConsulta,
  atualizar,
}: Props) => {
  const [nome, setNome] = useState(tipoConsulta.nome);
  const [preco, setPreco] = useState<string>(
    tipoConsulta.preco !== undefined && tipoConsulta.preco !== null
      ? String(tipoConsulta.preco)
      : ""
  );
  const [duracaoEstimadaMinutos, setDuracaoEstimadaMinutos] = useState<string>(
    tipoConsulta.duracaoEstimadaMinutos !== undefined &&
      tipoConsulta.duracaoEstimadaMinutos !== null
      ? String(tipoConsulta.duracaoEstimadaMinutos)
      : ""
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (nome == "" || preco == null) {
      toast.error("Preencha todos os campos obrigatórios!");
    } else {
      const tipoConsultaAtualizado = {
        id: tipoConsulta.id,
        nome: nome,
        preco: preco === "" ? null : Number(preco),
        duracaoEstimadaMinutos:
          duracaoEstimadaMinutos === "" ? null : Number(duracaoEstimadaMinutos),
      };
      try {
        await api.put(
          `/tipos-consulta/${tipoConsulta.id}`,
          tipoConsultaAtualizado
        );
        atualizar();
        toast.success("Tipo de consulta atualizado com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao atualizar tipo de consulta!");
      }
    }
  };

  return (
    <TooltipProvider key={tipoConsulta.id}>
      <div className="flex flex-row items-center w-full mt-4 cursor-pointer overflow-hidden rounded-2xl p-4 mb-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <Dialog>
          <DialogTrigger asChild>
            <figure>
              <div className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl">
                  <span className="text-2xl">🏷️</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                    <span className="text-sm sm:text-lg">
                      {tipoConsulta.nome}
                    </span>
                    <span className="mx-1">·</span>
                    <span className="text-xs text-gray-500">
                      {Number(tipoConsulta.preco).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </figcaption>
                  {tipoConsulta.duracaoEstimadaMinutos && (
                    <p className="text-sm font-normal dark:text-white">
                      Atendimentos duram aproximadamente{" "}
                      {tipoConsulta.duracaoEstimadaMinutos} minutos
                    </p>
                  )}
                </div>
              </div>
            </figure>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar tipo de consulta</DialogTitle>
              <DialogDescription>
                Edite os dados do seu tipo de consulta
              </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="nome" className="mb-2">
                  Nome
                </Label>
                <Input
                  id="nome"
                  value={nome}
                  placeholder="Nome do tipo de consulta"
                  onChange={(E) => setNome(E.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">Preço</Label>
                <Input
                  type="text"
                  value={preco}
                  placeholder="R$ 0,00"
                  onChange={(e) => setPreco(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2">
                  Duração estimada em minutos (Opcional)
                </Label>
                <Input
                  type="text"
                  value={duracaoEstimadaMinutos}
                  placeholder="Duração estimada em minutos (Opcional)"
                  onChange={(e) => setDuracaoEstimadaMinutos(e.target.value)}
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
                    Editar
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
                <DialogTitle>Deseja excluir este tipo de consulta?</DialogTitle>
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
                  <Button
                    onClick={deletarTipoConsulta}
                    className="cursor-pointer"
                  >
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

export default TipoConsultaList;
