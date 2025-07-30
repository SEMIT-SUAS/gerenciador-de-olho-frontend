import { useEffect, useState } from "react";
import type { Services } from "../../types/Services";
import { Link, useNavigate } from "react-router-dom";
import { changeServiceAtivo, changeServiceVisibility, getAllServices } from "../../services/servicosServices";
import { toast } from "react-toastify";

export function ServicesList() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchServices() {
      try {
        const allServices = await getAllServices();
        setServices(allServices);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar os serviços.");
      } finally {
        setLoading(false);
      }
    }

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
        toast.success(`Visibilidade alterada para ${newVisibility}`);
        // Atualize o estado local se necessário
      })
      .catch((error) => {
        toast.error(error.message);
    });
  }

  function handleToggleActive(id: number, ativo: boolean) {
    const newAtivo = !ativo;

    changeServiceAtivo(id, newAtivo)
      .then(() => {
        toast.success(`Ativo alterado para ${newAtivo}`);
        // Atualize o estado local se necessário
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

      <input
        type="text"
        placeholder="Pesquisar por nome..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "1rem", padding: "6px", width: "100%" }}
      />

      <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredServices.map((service) => (
            <li
              key={service.id}
              style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: "4px",
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
              }}
              >
              <Link to={`/servico/${service.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                <h3>{service.nome}</h3>
                <p><strong>Descrição:</strong> {service.descricao}</p>
                <p><strong>Categoria:</strong> {service.categoria?.nome}</p>
              </Link>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                <button onClick={() => handleEdit(service.id!)}>Editar</button>
                <button onClick={() => handleToggleVisibility(service.id!, service.visivel)}>
                {service.visivel ? 'Ocultar' : 'Mostrar'}
                </button>
                <button onClick={() => handleToggleActive(service.id!, service.ativo)}>
                {service.ativo ? 'Inativar' : 'Ativar'}
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}