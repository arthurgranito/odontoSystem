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
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface CadastroEscalaProps {
  onTipoCadastrado: () => void | Promise<void>;
}

const CadastroTipoConsulta = ({ onTipoCadastrado }: CadastroEscalaProps) => {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracaoMinutos, setDuracaoMinutos] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (
      nome == "" ||
      preco == ""
    ) {
      toast.error("Preencha todos os campos obrigatórios!");
    } else {
      const tipoConsulta = {
        nome: nome,
        preco: preco,
        duracaoEstimadaMinutos: duracaoMinutos,
        dentista: user,
      };
      try {
        await api.post("/tipos-consulta", tipoConsulta);
        setNome("");
        setPreco("");
        setDuracaoMinutos("");
        toast.success("Tipo de consulta cadastrado com sucesso!");
        if (onTipoCadastrado) await onTipoCadastrado();
      } catch (error) {
        console.log(error);
        toast.error("Erro ao cadastrar tipo de consulta!");
      }
    }
  };

  return (
    <Card className="h-fit overflow-auto">
      <CardHeader>
        <CardTitle>Cadastro de Tipos de Consulta</CardTitle>
        <CardDescription>
          Preencha com as informações necessárias para criar o seu tipo de consulta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <div>
            <Label className="mb-2">Nome</Label>
            <Input placeholder="Nome do tipo de consulta" value={nome} onChange={(e) => setNome(e.target.value)}/>
          </div>

          <div>
            <Label className="mb-2">Preço estimado da consulta</Label>
            <Input placeholder="R$ 0,00" type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
          </div>

          <div>
            <Label>Duração estimada em minutos (Opcional)</Label>
            <Input
              className="mt-2 text-sm"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={duracaoMinutos}
              onChange={(e) => setDuracaoMinutos(e.target.value)}
              placeholder="Duração estimada em minutos (Opcional)"
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

export default CadastroTipoConsulta;
