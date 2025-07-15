import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import type { Escala } from "../../types/Escala";
import api from "../../services/api";
import { toast } from "react-toastify";
import EscalaList from "./EscalaList";
import image from "../../assets/images/empty.svg";
import { useState } from "react";
import { Input } from "../ui/input";

interface TodasEscalasProps {
  escalas: Escala[];
  atualizarEscalas: () => void | Promise<void>;
}

const TodasEscalas = ({ escalas, atualizarEscalas }: TodasEscalasProps) => {
  const deletarEscala = async (id: number) => {
    try {
      await api.delete(`/escalas/${id}`);
      toast.success("Escala deletada com sucesso!");
      atualizarEscalas();
    } catch (error: any) {
      toast.error("Erro ao deletar escala!");
      console.error(error);
    }
  };

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 3;

  const escalasFiltradas = escalas.filter((es) =>
    es.diaSemana.toLowerCase().includes(busca.toLowerCase())
  );
  const totalPaginas = Math.ceil(escalasFiltradas.length / registrosPorPagina);
  const escalasPaginadas = escalasFiltradas.slice((pagina - 1) * registrosPorPagina, pagina * registrosPorPagina);

  // Função utilitária para gerar itens de paginação com ellipsis
  function getPaginationItems(pagina: number, totalPaginas: number) {
    const items = [];
    if (totalPaginas <= 3) {
      for (let i = 1; i <= totalPaginas; i++) items.push(i);
    } else {
      if (pagina <= 2) {
        items.push(1, 2, 3, 'ellipsis');
      } else if (pagina >= totalPaginas - 1) {
        items.push('ellipsis', totalPaginas - 2, totalPaginas - 1, totalPaginas);
      } else {
        items.push('ellipsis', pagina - 1, pagina, pagina + 1, 'ellipsis');
      }
    }
    return items;
  }

  return (
    <Card className="max-h-[85vh] overflow-auto">
      <CardHeader>
        <CardTitle>Registro de Escalas</CardTitle>
        <CardDescription>
          Detalhes de todas as suas escalas cadastradas
        </CardDescription>
        <Input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar escala por dia da semana..."
        />
        <CardContent className="flex flex-col gap-0 px-0">
          {escalasFiltradas.length > 0 ? (
            <>
              {escalasPaginadas.map((escala) => (
                <EscalaList
                  escala={escala}
                  deletarEscala={() => deletarEscala(escala.id)}
                  atualizar={atualizarEscalas}
                  key={escala.id}
                />
              ))}
              {totalPaginas > 0 && (
                <div className="flex justify-center gap-1 mt-4 items-center select-none">
                  <button
                    className="w-8 h-8 rounded-full bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition"
                    onClick={() => setPagina(1)}
                    disabled={pagina === 1}
                    aria-label="Primeira página"
                  >
                    «
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition"
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={pagina === 1}
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>
                  {getPaginationItems(pagina, totalPaginas).map((num, idx) =>
                    num === 'ellipsis' ? (
                      <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                    ) : (
                      <button
                        key={num}
                        className={`w-8 h-8 rounded-full font-medium transition ${pagina === num ? 'bg-cyan-600 text-white shadow' : 'bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/40'}`}
                        onClick={() => setPagina(Number(num))}
                        aria-current={pagina === num ? 'page' : undefined}
                      >
                        {num}
                      </button>
                    )
                  )}
                  <button
                    className="w-8 h-8 rounded-full bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition"
                    onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                    disabled={pagina === totalPaginas}
                    aria-label="Próxima página"
                  >
                    ›
                  </button>
                  <button
                    className="w-8 h-8 rounded-full bg-transparent text-cyan-700 dark:text-cyan-200 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 transition"
                    onClick={() => setPagina(totalPaginas)}
                    disabled={pagina === totalPaginas}
                    aria-label="Última página"
                  >
                    »
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <img
                src={image}
                alt="Imagem de nenhuma escala encontrada"
                className="h-[450px] w-[450px] mx-auto"
              />
              <h1 className="text-center">Nenhuma escala cadastrada!</h1>
            </>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default TodasEscalas;
