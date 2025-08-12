import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllServicoExterno, changeServiceVisibility, changeServiceExternoAtivo } from "../../services/servicoExternoService";
import type { ServiceExterno } from "../../types/ServicoExterno";
import { FormServicoExterno } from "./components/FormServicoExterno";
import { ModalEditarServicoExterno } from "./components/ModalEditarServicoExterno";

export function ServicoExternoList() {
  const [servicos, setServicos] = useState<ServiceExterno[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalEdicaoId, setModalEdicaoId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const dados = await getAllServicoExterno();
      setServicos(dados);
      //console.log(dados);
    } catch (error: any) {
      setMensagem(error.message || "Erro ao carregar serviços.");
    }
  }

  async function toggleVisibilidade(servico: ServiceExterno) {
    try {
      setLoading(true);
      const data = await changeServiceVisibility(servico.id, !servico.visivel);
      if (typeof data === "object" && "retorno" in data && data.retorno) {
        toast.success(data.retorno);
      }
      await carregarServicos();
    } catch (error: any) {
      toast.error(error?.message || "Erro ao alterar visibilidade.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleAtividade(servico: ServiceExterno) {
    try {
      setLoading(true);
      const mensagem = await changeServiceExternoAtivo(servico.id, !servico.ativo);
      toast.success(mensagem || "Status atualizado com sucesso.");
      setServicos((prev) =>
        prev.map((s) =>
          s.id === servico.id ? { ...s, ativo: !s.ativo } : s
        )
      );
    } catch (error: any) {
      toast.error(error?.message || "Erro ao alterar atividade.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Serviços Externos</h2>
      <button onClick={() => setModalAberto(true)}>+ Novo Serviço</button>

      {mensagem && <p>{mensagem}</p>}

      <ul>
        {servicos.map((s) => (
          <li key={s.id}>
            <strong>{s.nome}</strong>{" "}
            {s.imagem && <img src={s.imagem} alt={s.nome} style={{ height: 40 }} />}
            {" - "}
            {s.link && (
              <>
                <a href={s.link} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 8 }}>
                  Abrir Link
                </a>{" "}
              </>
            )}
            {s.visivel ? "Visível" : "Oculto"} | {s.ativo ? "Ativo" : "Inativo"}{" "}
            <button onClick={() => toggleVisibilidade(s)} disabled={loading}>
              {s.visivel ? "Ocultar" : "Mostrar"}
            </button>
            <button
              onClick={() => toggleAtividade(s)}
              disabled={loading}
              style={{ marginLeft: "8px" }}
            >
              {s.ativo ? "Desativar" : "Ativar"}
            </button>
            <button
              onClick={() => setModalEdicaoId(s.id)}
              style={{ marginLeft: "8px" }}
            >
              Editar
            </button>
          </li>
        ))}
      </ul>

      {modalAberto && (
        <FormServicoExterno
          onClose={() => setModalAberto(false)}
          onSuccess={() => {
            carregarServicos();
            setModalAberto(false);
          }}
        />
      )}

      {modalEdicaoId !== null && (
        <ModalEditarServicoExterno
          servicoId={modalEdicaoId}
          onClose={() => setModalEdicaoId(null)}
          onSuccess={() => {
            carregarServicos();
            setModalEdicaoId(null);
          }}
        />
      )}
    </div>
  );
}
