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
import { toast, ToastContainer } from "react-toastify";
import api from "../../services/api";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import formatarTelefone from "../../services/formataTelefone";
import formatarDataNascimento from "../../services/formataDataNascimento";
import converteDataParaISO from "../../services/converteDataParaISO";

interface CadastroPacienteProps {
  onPacienteCadastrado: () => void | Promise<void>;
}

const CadastroPaciente = ({ onPacienteCadastrado }: CadastroPacienteProps) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (nome == "" || telefone == "" || email == "" || dataNascimento == "") {
      toast.error("Preencha todos os campos obrigatórios!");
    } else {
      const paciente = {
        nome: nome,
        telefone: telefone,
        email: email,
        dataNascimento: converteDataParaISO(dataNascimento),
        observacoes: observacoes,
        dentista: user,
      };
      try {
        await api.post("/pacientes", paciente);
        setNome("");
        setTelefone("");
        setEmail("");
        setDataNascimento("");
        setObservacoes("");
        toast.success("Paciente cadastrado com sucesso!");
        if (onPacienteCadastrado) await onPacienteCadastrado();
      } catch (error: any) {
        console.log(error);
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <Card className="h-fit overflow-auto">
      <ToastContainer />
      <CardHeader>
        <CardTitle>Cadastro de Pacientes</CardTitle>
        <CardDescription>
          Preencha com as informações necessárias para cadastrar o seu paciente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2">Nome</Label>
            <Input
              placeholder="Nome do paciente"
              value={nome}
              className="text-sm"
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <Label className="mb-2">Telefone / Celular</Label>
            <Input
              placeholder="(21) 99999-9999"
              className="text-sm"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              className="mt-2 text-sm"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailpaciente@gmail.com"
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

          <Button className="cursor-pointer" type="submit">
            Cadastrar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CadastroPaciente;
