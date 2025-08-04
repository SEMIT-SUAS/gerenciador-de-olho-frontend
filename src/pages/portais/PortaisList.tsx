import { useEffect, useState } from "react";
import type { Portais } from "../../types/Portais";
import { toast } from "react-toastify";
import { PortalModal } from "./components/PortalModal";
import { PortalCard } from "./components/PortalCard";
import { getAllPortais, createPortal, toggleAtivo, changeServiceVisibility } from "../../services/PortaisService";
import { portalSchema } from "../../schemas/portalSchema";

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
      // valida dados do form com Zod
      const dadosValidados = portalSchema.parse(newPortal);

      const portalCriado = await createPortal(dadosValidados);

      setPortais((prev) => [...prev, portalCriado]);
      setIsModalOpen(false);
      setNewPortal({
        nome: "",
        destaque: false,
        link: "",
        visivel: true,
        ativo: true,
      });
      toast.success("Portal cadastrado com sucesso!");
    } catch (error: any) {
      // tratamento de erro do Zod
      if (error.name === "ZodError") {
        const mensagens = error.errors.map((err: any) => err.message).join("\n");
        toast.error(mensagens);
      } else {
        toast.error("Erro ao criar portal");
      }
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

  async function handleServiceVisibility(id: number, visivel: boolean) {
    try{
      await changeServiceVisibility(id, !visivel);
      setPortais((prev) => 
        prev.map((p) =>
          p.id === id ? { ...p, visivel: !visivel} : p
      )
     );
    } catch (error) {
      alert("Erro ao atualizar status de atividade")
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
          <PortalCard
            key={portal.id}
            portal={portal}
            onToggleAtivo={handleToggleAtivo}
            onToggleVisivel={handleServiceVisibility}
          />
        ))}
      </ul>

      <PortalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newPortal={newPortal}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmitNewPortal}
      />

    </div>
  );
}