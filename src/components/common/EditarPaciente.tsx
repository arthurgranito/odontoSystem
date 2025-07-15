import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "react-toastify";
import api from "../../services/api";
import formatarTelefone from "../../services/formataTelefone";

import type { PacienteResponse } from "../../types/Paciente";

interface EditarPacienteProps {
  paciente: PacienteResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onPacienteEditado: () => void;
}

const EditarPaciente: React.FC<EditarPacienteProps> = ({
  paciente,
  isOpen,
  onClose,
  onPacienteEditado
}) => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (paciente) {
      setNome(paciente.nome || "");
      setTelefone(paciente.telefone || "");
      setEmail(paciente.email || "");
      // Converter data para formato do input (YYYY-MM-DD) sem problemas de fuso horário
      if (paciente.dataNascimento) {
        // Se a data já está no formato YYYY-MM-DD, usar diretamente
        if (paciente.dataNascimento.includes('-') && paciente.dataNascimento.length === 10) {
          setDataNascimento(paciente.dataNascimento);
        } else {
          // Para datas ISO completas, extrair apenas a parte da data
          const data = new Date(paciente.dataNascimento + 'T00:00:00.000Z');
          setDataNascimento(data.toISOString().split('T')[0]);
        }
      } else {
        setDataNascimento("");
      }
      setObservacoes(paciente.observacoes || "");
    }
  }, [paciente]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paciente) return;
    
    if (!nome || !telefone || !email || !dataNascimento) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsLoading(true);
    try {
      const dadosAtualizados = {
        nome,
        telefone,
        email,
        dataNascimento, // Já está no formato YYYY-MM-DD do input
        observacoes,
      };

      await api.put(`/pacientes/${paciente.id}`, dadosAtualizados);
      toast.success("Paciente atualizado com sucesso!");
      onPacienteEditado();
      onClose();
    } catch (error: any) {
      console.error('Erro ao atualizar paciente:', error);
      toast.error(error.response?.data?.message || "Erro ao atualizar paciente!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNome("");
    setTelefone("");
    setEmail("");
    setDataNascimento("");
    setObservacoes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Paciente</DialogTitle>
          <DialogDescription>
            Atualize as informações do paciente {paciente?.nome}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do paciente"
              required
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone / Celular *</Label>
            <Input
              id="telefone"
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
              placeholder="(21) 99999-9999"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailpaciente@gmail.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
            <Input
              id="dataNascimento"
              type="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Alergias, etc (Opcional)"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarPaciente;