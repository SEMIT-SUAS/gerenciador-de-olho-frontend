import { useEffect, useState } from "react";
import { getAllServicoExterno, uploadServicoExterno, changeServiceVisibility } from "../../services/servicoExternoService";
import type { ServiceExterno } from "../../types/ServicoExterno";
import { toast } from "react-toastify";

export function ServicoExternoList() {
  const [servicos, setServicos] = useState<ServiceExterno[]>([]);
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [visivel, setVisivel] = useState(true);
  const [ativo, setAtivo] = useState(true);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [loading, setLoading] = useState(false);

  // Carregar lista ao abrir a página
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
      // Chama a API invertendo o valor atual da visibilidade
      await changeServiceVisibility(servico.id, !servico.visivel);
      // Recarrega a lista após a atualização
      await carregarServicos();
      toast.success(`Visibilidade do serviço "${servico.nome}" alterada.`);
    } catch (error: any) {
      toast.error(error.message || "Erro ao alterar visibilidade.");
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("nome", nome);
    if (imagem) formData.append("imagem", imagem);
    formData.append("visivel", String(visivel));
    formData.append("ativo", String(ativo));

    try {
      await uploadServicoExterno(formData);
      toast.success("Serviço cadastrado com sucesso!");
      setModalAberto(false);
      setNome("");
      setImagem(null);
      setVisivel(true);
      setAtivo(true);
      carregarServicos(); // Atualiza lista
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

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
            {s.visivel ? "Visível" : "Oculto"} | {s.ativo ? "Ativo" : "Inativo"}
            {" "}
            <button onClick={() => toggleVisibilidade(s)} disabled={loading}>
              {s.visivel ? "Ocultar" : "Mostrar"}
            </button>
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalAberto && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>Cadastrar Novo Serviço</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Nome:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div>
                <label>Imagem:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagem(e.target.files?.[0] || null)}
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={visivel}
                    onChange={(e) => setVisivel(e.target.checked)}
                  />
                  Visível
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) => setAtivo(e.target.checked)}
                  />
                  Ativo
                </label>
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Enviando..." : "Cadastrar"}
              </button>
              <button type="button" onClick={() => setModalAberto(false)}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos simples inline para o modal
const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "500px"
};
