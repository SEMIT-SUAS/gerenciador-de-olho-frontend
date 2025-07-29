import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Services } from "../../types/Services";
import { getServicoById, updateServico } from "../../services/servicosServices";

export function ServicoEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Services | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => 
  {
    async function fetchServico() {
      try {
        if (!id) return;
        const servico = await getServicoById(Number(id));
        setForm(servico);
      } catch (err: any) {
        setError(err.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }

    fetchServico();
  }, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) 
  {
    const { name, value, type } = e.target;

    let checked: boolean | undefined = undefined;
    if (e.target instanceof HTMLInputElement && (type === "checkbox" || type === "radio")) {
      checked = e.target.checked;
    }

    if (!form) return;

    if (name === "visivel" || name === "ativo") {
      // checked está garantido porque só entra aqui se for checkbox ou radio
      setForm({ ...form, [name]: checked ?? false });
      return;
    }

    if (name.startsWith("orgao.")) {
      setForm({
        ...form,
        secretaria: { ...form.secretaria, nome: value },
      });
      return;
    }

    if (name.startsWith("categoria.")) {
      setForm({
        ...form,
        categoria: { ...form.categoria, nome: value },
      });
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError(null);

    try {
      // Usa diretamente a função updateServico que retorna erro se falhar
      await updateServico(form);
      
      // Se chegou aqui, o serviço foi atualizado com sucesso
      navigate("/"); // redireciona após o sucesso
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p>Carregando dados do serviço...</p>;
  if (error) return <p style={{ color: "red" }}>Erro: {error}</p>;
  if (!form) return <p>Serviço não encontrado</p>;

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Editar Serviço</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input
            type="text"
            name="nome"
            value={form.nome}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descrição:
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            required
            rows={3}
          />
        </label>

        <label>
          Público Destinado:
          <textarea
            name="publicoDestinado"
            value={form.publicoDestinado}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Formas de Solicitação:
          <textarea
            name="formasSolicitacao"
            value={form.formasSolicitacao}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Documentação Necessária:
          <textarea
            name="documentacaoNecessaria"
            value={form.documentacaoNecessaria}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Custos:
          <input
            type="text"
            name="custos"
            value={form.custos}
            onChange={handleChange}
          />
        </label>

        <label>
          Etapas:
          <textarea
            name="etapas"
            value={form.etapas}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Requisitos:
          <textarea
            name="requisitos"
            value={form.requisitos}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Formas de Acompanhamento:
          <textarea
            name="formasAcompanhamento"
            value={form.formasAcompanhamento}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Prazo de Atendimento:
          <input
            type="text"
            name="prazoAtendimento"
            value={form.prazoAtendimento}
            onChange={handleChange}
          />
        </label>

        <label>
          Prioridades:
          <textarea
            name="prioridades"
            value={form.prioridades}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Horário de Atendimento:
          <input
            type="text"
            name="horarioAtendimento"
            value={form.horarioAtendimento}
            onChange={handleChange}
          />
        </label>

        <label>
          Legislação:
          <textarea
            name="legislacao"
            value={form.legislacao}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Órgão:
          <input
            type="text"
            name="orgao"
            value={form.secretaria?.nome}
            onChange={handleChange}
          />
        </label>

        <label>
          Categoria:
          <input
            type="text"
            name="categoria"
            value={form.categoria?.nome}
            onChange={handleChange}
          />
        </label>

        <label>
          Setor de Lotação:
          <input
            type="text"
            name="setorLotacao"
            value={form.setorLotacao}
            onChange={handleChange}
          />
        </label>

        <label>
          Modelo de Requerimento:
          <input
            type="text"
            name="modeloRequerimento"
            value={form.modeloRequerimento}
            onChange={handleChange}
          />
        </label>

        <label>
          Persona:
          <input
            type="text"
            name="persona"
            value={form.persona}
            onChange={handleChange}
          />
        </label>

        <label>
          Visível:
          <input
            type="checkbox"
            name="visivel"
            checked={form.visivel}
            onChange={handleChange}
          />
        </label>

        <label>
          Ativo:
          <input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
