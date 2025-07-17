// src/pages/ServicoDetalhes.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Services } from "../../types/Services";
import { getServicoById } from "../../services/servicosServices";

export function ServicoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Services | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      try {
        if (!id) return;
        const servico = await getServicoById(Number(id));
        setService(servico);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar o serviço.");
      } finally {
        setLoading(false);
      }
    }

    fetchService();
  }, [id]);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  if (!service) return <p>Serviço não encontrado.</p>;

  return (
    <div>
      <h2>{service.nome}</h2>
      <p><strong>Descrição:</strong> {service.descricao}</p>
      <p><strong>Público:</strong> {service.publicoDestinado}</p>
      <p><strong>Forma de Solicitação:</strong> {service.formasSolicitacao}</p>
      <p><strong>documentacao Necessaria:</strong> {service.documentacaoNecessaria}</p>
      <p><strong>custos:</strong> {service.custos}</p>
      <p><strong>etapas:</strong> {service.etapas}</p>
      <p><strong>requisitos:</strong> {service.requisitos}</p>
      <p><strong>formas de Acompanhamento:</strong> {service.formasAcompanhamento}</p>
      <p><strong>prazo de Atendimento:</strong> {service.prazoAtendimento}</p>
      <p><strong>prioridades:</strong> {service.prioridades}</p>
      <p><strong>horário de Atendimento:</strong> {service.horarioAtendimento}</p>
      <p><strong>Legislação:</strong> {service.legislacao}</p>
      <p><strong>orgão:</strong> {service.orgao.nome}</p>
      <p><strong>categoria:</strong> {service.categoria.nome}</p>
      <p><strong>setor de Lotação:</strong> {service.setorLotacao}</p>
      <p><strong>modelo de Requerimento:</strong> {service.modeloRequerimento}</p>
      <p><strong>Persona:</strong> {service.persona}</p>
      <p><strong>visivel:</strong> {service.visivel ? "Sim" : "Não"}</p>
      <p><strong>ativo:</strong> {service.ativo ? "Sim" : "Não"}</p>
      {/* Adicione outros campos conforme necessário */}
    </div>
  );
}