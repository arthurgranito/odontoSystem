import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import api from "../../services/api";
import { toast } from "react-toastify";
import image from "../../assets/images/empty.svg";
import type { TipoConsulta } from "../../types/TipoConsulta";
import TipoConsultaList from "./TipoConsultaList";
import { useState } from "react";
import { Input } from "../ui/input";

interface TodosTiposConsultaProps {
  tiposConsulta: TipoConsulta[];
  atualizarTiposConsulta: () => void | Promise<void>;
}

const TodosTiposConsulta = ({
  tiposConsulta,
  atualizarTiposConsulta,
}: TodosTiposConsultaProps) => {
  const deletarTipoConsulta = async (id: number) => {
    try {
      await api.delete(`/tipos-consulta/${id}`);
      toast.success("Tipo de consulta deletado com sucesso!");
      atualizarTiposConsulta();
    } catch (error) {
      toast.error("Erro ao deletar tipo de consulta!");
    }
  };

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const registrosPorPagina = 3;

  const tiposFiltrados = tiposConsulta.filter(tc =>
    tc.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const totalPaginas = Math.ceil(tiposFiltrados.length / registrosPorPagina);
  const tiposPaginados = tiposFiltrados.slice((pagina - 1) * registrosPorPagina, pagina * registrosPorPagina);

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
        <CardTitle>Registro de Tipos de Consulta</CardTitle>
        <CardDescription>
          Detalhes de todos os seus tipos de consulta cadastrados
        </CardDescription>
        <Input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar tipo de consulta pelo nome..."
        />
        <CardContent className="flex flex-col gap-0 px-0">
          {tiposFiltrados.length > 0 ? (
            <>
              {tiposPaginados.map((tipoConsulta) => (
                <TipoConsultaList
                  tipoConsulta={tipoConsulta}
                  deletarTipoConsulta={() => deletarTipoConsulta(tipoConsulta.id)}
                  atualizar={atualizarTiposConsulta}
                  key={tipoConsulta.id}
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
                alt="Imagem de nenhum tipo de consulta encontrado"
                className="h-[450px] w-[450px] mx-auto"
              />
              <h1 className="text-center">Nenhum tipo de consulta cadastrado!</h1>
            </>
          )}
        </CardContent>
      </CardHeader>
    </Card>
  );
};

export default TodosTiposConsulta;
