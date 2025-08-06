import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAllServicoExterno, changeServiceVisibility } from "../../services/servicoExternoService";
import type { ServiceExterno } from "../../types/ServicoExterno";
import { FormularioServicoExterno } from "./components/FormularioServicoExterno";

export function ServicoExternoList() {
  const [servicos, setServicos] = useState<ServiceExterno[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const dados = await getAllServicoExterno();
      setServicos(dados);
    } catch (error: any) {
      setMensagem(error.message || "Erro ao carregar serviços.");
    }
  }

  async function toggleVisibilidade(servico: ServiceExterno) {
    try {
      setLoading(true);
      await changeServiceVisibility(servico.id, !servico.visivel);
      await carregarServicos();
      toast.success(`Visibilidade do serviço "${servico.nome}" alterada.`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar visibilidade.");
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
            {s.visivel ? "Visível" : "Oculto"} | {s.ativo ? "Ativo" : "Inativo"}{" "}
            <button onClick={() => toggleVisibilidade(s)} disabled={loading}>
              {s.visivel ? "Ocultar" : "Mostrar"}
            </button>
          </li>
        ))}
      </ul>

      {modalAberto && (
        <FormularioServicoExterno
          onClose={() => setModalAberto(false)}
          onSuccess={() => {
            carregarServicos();
            setModalAberto(false);
          }}
        />
      )}
    </div>
  );
}
