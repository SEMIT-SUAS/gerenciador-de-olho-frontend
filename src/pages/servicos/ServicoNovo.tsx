import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateService } from "../../types/Services";
import { createService } from "../../services/servicosServices";
import { getAll } from "../../services/secretariaService";
import type { SecretariaModel } from "../../types/Secretaria";
import { getAllCategorias } from "../../services/servicocategoriaService";
import type { ServicoCategoria } from "../../types/CategoriaServico";
import { getAllPerosona } from "../../services/servicoPersona";
import type { Persona } from "../../types/Persona";
import { FormServicos } from "../../components/Servicos/FormServicos";


export function ServicoNovo() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateService>({
    id: null,
    orgao: null,
    secretaria: null,
    nome: "",
    descricao: "",
    publicoDestinado: [],
    formasSolicitacao: [],
    documentacaoNecessaria: [],
    custos: "",
    etapas: "",
    requisitos: "",
    formasAcompanhamento: "",
    prazoAtendimento: "",
    prioridades: "",
    horarioAtendimento: "",
    legislacao: "",
    categoria: null,
    setorLotacao: "",
    modeloRequerimento: "",
    persona: [],
    visivel: true,
    ativo: true,
  });

  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);
  const [persona, setPersona] = useState<Persona[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [secretariasData, categoriasData, personaData] = await Promise.all([
          getAll(),
          getAllCategorias(),
          getAllPerosona(),
        ]);
        setSecretarias(secretariasData);
        setCategorias(categoriasData);
        setPersona(personaData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      }
    }
    fetchDados();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        orgao: form.secretaria?.id ?? null,
        categoria: form.categoria?.id ?? null,
        personas: form.persona.map((p) => p.id),
      };

      // Remove o campo secretaria para não enviar objeto completo
      delete (payload as any).secretaria;

      await createService(payload);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormServicos
      form={form}
      setForm={setForm}
      categorias={categorias}
      secretarias={secretarias}
      persona={persona}
      loading={loading}
      error={error}
      handleSubmit={handleSubmit}
    />
  );
}
