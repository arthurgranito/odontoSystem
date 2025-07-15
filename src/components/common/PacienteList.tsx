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
import type { Paciente } from "../../types/Paciente";
import formatarTelefone from "../../services/formataTelefone";
import formatarDataNascimento from "../../services/formataDataNascimento";
import converteDataParaISO from "../../services/converteDataParaISO";
import converteDataParaBR from "../../services/converteDataParaBR";
import calcularIdade from "../../services/calcularIdade";

interface Props {
  paciente: Paciente;
  deletarPaciente: () => void | Promise<void>;
  atualizar: () => void | Promise<void>;
}

const PacienteList = ({ paciente, deletarPaciente, atualizar }: Props) => {
  const [nome, setNome] = useState(paciente.nome);
  const [email, setEmail] = useState(paciente.email);
  const [telefone, setTelefone] = useState(paciente.telefone);
  const [observacoes, setObservacoes] = useState(paciente.observacoes);
  const [dataNascimento, setDataNascimento] = useState<string>(converteDataParaBR(new Date(paciente.dataNascimento)));

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (nome == "" || email == "" || telefone == "" || dataNascimento == "") {
      toast.error("Preencha todos os campos obrigatórios!");
    } else {
      const pacienteAtualizado = {
        id: paciente.id,
        nome: nome,
        email: email,
        telefone: telefone,
        observacoes: observacoes,
        dataNascimento: converteDataParaISO(dataNascimento)
      };
      try {
        await api.put(
          `/pacientes/${paciente.id}`,
          pacienteAtualizado
        );
        atualizar();
        toast.success("Paciente atualizado com sucesso!");
      } catch (error: any) {
        console.error(error);
        toast.error("Erro ao atualizar paciente");
      }
    }
  };

  return (
    <TooltipProvider key={paciente.id}>
      <div className="flex flex-row items-center w-full mt-4 cursor-pointer overflow-hidden rounded-2xl p-4 mb-4 transition-all duration-200 ease-in-out hover:scale-[103%] bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
        <Dialog>
          <DialogTrigger asChild>
            <figure>
              <div className="flex flex-row items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
                    <span className="text-sm sm:text-lg">{nome}</span>
                    <span className="mx-1">·</span>
                    <span className="text-xs text-gray-500">
                      {dataNascimento}
                    </span>
                    <span className="mx-1">·</span>
                    <span className="text-xs text-gray-500">
                        {calcularIdade(dataNascimento)} anos
                    </span>
                  </figcaption>
                  <p className="text-sm font-normal dark:text-white">
                    Contatos: {email} - {telefone}
                  </p>
                  {paciente.observacoes && (
                    <p className="text-sm font-normal dark:text-white">
                      Observações: {observacoes}
                    </p>
                  )}
                </div>
              </div>
            </figure>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Editar dados do paciente</DialogTitle>
              <DialogDescription>
                Edite os dados do seu paciente
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
                <Label className="mb-2">Telefone</Label>
                <Input
                  placeholder="(21) 99999-9999"
                  className="text-sm"
                  type="tel"
                  value={telefone}
                  onChange={(e) =>
                    setTelefone(formatarTelefone(e.target.value))
                  }
                />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input
                  type="email"
                  value={email}
                  placeholder="emailpaciente@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <Label>Data de Nascimento</Label>
                <Input
                  className="mt-2 text-sm"
                  type="text"
                  value={dataNascimento}
                  onChange={(e) =>
                    setDataNascimento(formatarDataNascimento(e.target.value))
                  }
                  placeholder="dd/mm/aaaa"
                  maxLength={10}
                />
              </div>

              <div>
                <Label>Observações (Opcional)</Label>
                <Input
                  className="mt-2 text-sm"
                  type="text"
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Alergias, etc (Opcional)"
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
                <DialogTitle>Deseja excluir este paciente?</DialogTitle>
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
                  <Button onClick={deletarPaciente} className="cursor-pointer">
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

export default PacienteList;
