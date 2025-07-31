import { useEffect, useState } from "react";
import type { Services } from "../../types/Services";
import { Link, useNavigate } from "react-router-dom";
import { changeServiceAtivo, changeServiceVisibility, getAllServices } from "../../services/servicosServices";
import { toast } from "react-toastify";
import { SearchInput } from "./components/SearchInput";
import { ServiceItem } from "./components/ServiceItem";

export function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  async function fetchServices() {
    setLoading(true);
    try {
      const allServices = await getAllServices();
      setServices(allServices);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar os serviços.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

    function handleEdit(id: number) {
    // Por exemplo, navegar para a página de edição
    navigate(`/servico/editar/${id}`);
    }

  function handleToggleVisibility(id: number, visivel: boolean) {
    const newVisibility = !visivel;

    changeServiceVisibility(id, newVisibility)
      .then(() => {
        const mensagem = newVisibility ? "mostrar" : "ocultar";
        toast.success(`Visibilidade alterada para ${mensagem}`);
        fetchServices();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }

  function handleToggleActive(id: number, ativo: boolean) {
    const newAtivo = !ativo;

    changeServiceAtivo(id, newAtivo)
      .then(() => {
        const mensagem = newAtivo ? "ativar" : "inativar";
        toast.success(`Visibilidade alterada para ${mensagem}`);
        fetchServices();
      })
      .catch((error) => {
        toast.error(error.message);
    });
  }

  const filteredServices = services.filter((service) =>
    service.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <div>
      <h2>Lista de Serviços</h2>

      {/* Botão para adicionar serviço */}
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/servico/novo" style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "4px",
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block"
        }}>
          + Adicionar Serviço
        </Link>
      </div>

       <SearchInput value={searchTerm} onChange={setSearchTerm} />

      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredServices.map((service) => (
          <ServiceItem
            key={service.id}
            service={service}
            onEdit={handleEdit}
            onToggleVisibility={handleToggleVisibility}
            onToggleActive={handleToggleActive}
          />
        ))}
      </ul>
    </div>
  );
}