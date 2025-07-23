import { useEffect, useState } from "react";
import type { Portais } from "../../types/Portais";
import { Link } from "react-router-dom";
import { getAllPortais, createPortal, toggleAtivo } from "../../services/PortaisService";

export function PortaisList() {
  const [portais, setPortais] = useState<Portais[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state para o novo portal
  const [newPortal, setNewPortal] = useState<Portais>({
    nome: "",
    destaque: false,
    link: "",
    visivel: true,
    ativo: true,
  });

  useEffect(() => {
    async function fetchPortais() {
      try {
        const allPortais = await getAllPortais();
        setPortais(allPortais);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar os portais.");
      } finally {
        setLoading(false);
      }
    }

    fetchPortais();
  }, []);

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type, checked } = e.target;
    setNewPortal((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmitNewPortal(e: React.FormEvent) {
  e.preventDefault();
  try {
    const portalCriado = await createPortal(newPortal); // <-- chama o serviço que envia para o backend
    setPortais((prev) => [...prev, portalCriado]); // usa o que veio do backend (com ID real, etc)
    setIsModalOpen(false);
    setNewPortal({
      nome: "",
      destaque: false,
      link: "",
      visivel: true,
      ativo: true,
    });
  } catch (error) {
    alert("Erro ao criar portal");
  }
}

async function handleToggleAtivo(id: number, ativo: boolean) {
    try {
      await toggleAtivo(id, !ativo);
      setPortais((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ativo: !ativo } : p
        )
      );
    } catch (error) {
      alert("Erro ao atualizar status de atividade");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h2>Listar Portais</h2>

      <button onClick={() => setIsModalOpen(true)} style={{ marginBottom: "1rem" }}>
        + Adicionar Portal
      </button>
        <ul style={{ listStyle: "none", padding: 0 }}>
            {portais.map((portal) => (
                <li
                key={portal.id}
                style={{
                    border: "1px solid #ccc",
                    padding: "1rem",
                    marginBottom: "1rem",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
                >
                <div style={{ flex: 1 }}>
                    <Link
                    to={`/portal/${portal.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                    >
                    <h3>{portal.nome}</h3>
                    </Link>
                    <p>
                    <strong>Link:</strong>{" "}
                    <a
                        href={portal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {portal.link}
                    </a>
                    </p>
                </div>
                <button onClick={() => handleToggleAtivo(portal.id!, portal.ativo)}>
                    {portal.ativo ? "Inativar" : "Ativar"}
                </button>
                </li>
            ))}
        </ul>


      {/* Modal simples */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "2rem",
              borderRadius: "8px",
              width: "300px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3>Adicionar Portal</h3>
            <form onSubmit={handleSubmitNewPortal}>
              <label>
                Nome:
                <input
                  type="text"
                  name="nome"
                  value={newPortal.nome}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Destaque:
                <input
                  type="checkbox"
                  name="destaque"
                  checked={newPortal.destaque}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Link:
                <input
                  type="url"
                  name="link"
                  value={newPortal.link}
                  onChange={handleInputChange}
                  required
                />
              </label>

              <label>
                Visível:
                <input
                  type="checkbox"
                  name="is_visible"
                  checked={newPortal.visivel}
                  onChange={handleInputChange}
                />
              </label>

              <label>
                Ativo:
                <input
                  type="checkbox"
                  name="ativo"
                  checked={newPortal.ativo}
                  onChange={handleInputChange}
                />
              </label>

              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
