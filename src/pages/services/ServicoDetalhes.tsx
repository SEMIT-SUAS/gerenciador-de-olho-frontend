// src/pages/ServicoDetalhes.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { ServicoDetalhado } from "../../types/ServicoDetalhado";
import { getServicoById } from "../../services/servicosServices";

export function ServicoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<ServicoDetalhado | null>(null);
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

  const formatArray = (arr: string[] | undefined) =>
    arr && Array.isArray(arr) ? arr.join(', ') : '-';

  return (
    <div>
      <h2>{service.nome}</h2>
      <p><strong>Descrição:</strong> {service.descricao}</p>
      <p><strong>Público:</strong> {formatArray(service.publicoDestinado)}</p>
      <p><strong>Forma de Solicitação:</strong> {formatArray(service.formasSolicitacao)}</p>
      <p><strong>Documentação Necessária:</strong> {formatArray(service.documentacaoNecessaria)}</p>
      <p><strong>Custos:</strong> {service.custos}</p>
      <p><strong>Etapas:</strong> {service.etapas}</p>
      <p><strong>Requisitos:</strong> {service.requisitos}</p>
      <p><strong>Formas de Acompanhamento:</strong> {service.formasAcompanhamento}</p>
      <p><strong>Prazo de Atendimento:</strong> {service.prazoAtendimento}</p>
      <p><strong>Prioridades:</strong> {service.prioridades}</p>
      <p><strong>Horário de Atendimento:</strong> {service.horarioAtendimento}</p>
      <p><strong>Legislação:</strong> {service.legislacao}</p>
      <p><strong>Órgão:</strong> {service.nomeOrgao}</p>
      <p><strong>Categoria:</strong> {service.nomeCategoria}</p>
      <p><strong>Setor de Lotação:</strong> {service.setorLotacao}</p>
      <p><strong>Modelo de Requerimento:</strong> {service.modeloRequerimento}</p>
      <p><strong>Persona:</strong> {formatArray(service.nomesPersonas)}</p>
      <p><strong>Visível:</strong> {service.visivel ? "Sim" : "Não"}</p>
      <p><strong>Ativo:</strong> {service.ativo ? "Sim" : "Não"}</p>
    </div>
  );
}