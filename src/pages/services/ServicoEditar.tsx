import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServicoById, updateServico } from "../../services/servicosServices";
import type { Services } from "../../types/Services";
import { getAllCategorias } from "../../services/servicocategoriaService";
import { getAllSecretarias } from "../../services/secretariaService";
import { getAllPerosona } from "../../services/servicoPersona";
import type { ServicoCategoria } from "../../types/CategoriaServico";
import type { Secretaria } from "../../types/Secretaria";
import type { Persona } from "../../types/Persona";
import { toast } from "react-toastify";

function parseMultilineInput(text: string): string[] {
  return text.split(/\r?\n|,/).map((line) => line.trim()).filter((line) => line !== "");
}

export function ServicoEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Services | null>(null);
  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [persona, setPersona] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formasSolicitacaoTexto, setFormasSolicitacaoTexto] = useState('');
  const [documentacaoNecessariaTexto, setDocumentacaoNecessariaTexto] = useState('');
  const [publicoDestinadoTexto, setPublicoDestinadoTexto] = useState('');

  useEffect(() => {
  if (!id) return; // garante que id não é undefined

  async function fetchDados() {
    try {
      const serviceId = parseInt(id!); // aqui id é string, garantido pelo if

      const [service, secretariasData, categoriasData, personaData] = await Promise.all([
        getServicoById(serviceId),
        getAllSecretarias(),
        getAllCategorias(),
        getAllPerosona(),
      ]);

      const secretariaObj = secretariasData.find(s => s.nome === service.nomeOrgao);
      const categoriaObj = categoriasData.find(c => c.nome === service.nomeCategoria);
      const personaSelecionadas = personaData.filter(p =>service.nomesPersonas?.includes(p.nome));

      setSecretarias(secretariasData);
      setCategorias(categoriasData);
      setPersona(personaData);

      setForm({
        ...service,
        secretaria: secretariaObj || null,
        categoria: categoriaObj || null,
        persona: personaSelecionadas || [],
      });

      if (service.formasSolicitacao) {
        setFormasSolicitacaoTexto(service.formasSolicitacao.join(', '));
      }
      if (service.documentacaoNecessaria) {
        setDocumentacaoNecessariaTexto(service.documentacaoNecessaria.join(', '));
      }
      if (service.publicoDestinado) {
        setPublicoDestinadoTexto(service.publicoDestinado.join(', '));
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }

  fetchDados();
}, [id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    if (!form) return;

    if (name === "categoria") {
      const selectedCategoria = categorias.find((cat) => cat.id === Number(value));
      setForm({ ...form, categoria: selectedCategoria || null });
      return;
    }

    if (name === "formasSolicitacao") {
    setFormasSolicitacaoTexto(value);
    const lista = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setForm({ ...form, formasSolicitacao: lista });
    return;
  }

  if (name === "documentacaoNecessaria") {
    setDocumentacaoNecessariaTexto(value);
    const lista = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setForm({ ...form, documentacaoNecessaria: lista });
    return;
  }

  if (name === "publicoDestinado") {
    setPublicoDestinadoTexto(value);
    const lista = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setForm({ ...form, publicoDestinado: lista });
    return;
  }

    if (
      name === "publicoDestinado" ||
      name === "formasSolicitacao" ||
      name === "documentacaoNecessaria"
    ) {
      setForm({ ...form, [name]: parseMultilineInput(value) });
      return;
    }

    if (name === "secretaria") {
      const selectedSecretaria = secretarias.find((sec) => sec.id === Number(value));
      setForm({ ...form, secretaria: selectedSecretaria || null });
      return;
    }

    if (name === "persona") {
      const selectedId = Number(value);
      const exists = form.persona.some((p) => p.id === selectedId);
      if (exists) {
        const updated = form.persona.filter((p) => p.id !== selectedId);
        setForm({ ...form, persona: updated });
      } else {
        const selected = persona.find((p) => p.id === selectedId);
        if (selected) {
          setForm({ ...form, persona: [...form.persona, selected] });
        }
      }
      return;
    }

    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    // Garante que o id está dentro do payload
    const payload: Services = {
      ...form,
      orgao: form.secretaria?.id ?? null,
      categoria: form.categoria?.id ?? null,
      personas: form.persona.map(p => p.id),
      // inclui o id aqui para garantir que ele exista no payload
      id: form.id!,
    };

    // remove o campo secretaria porque backend não espera ele
    delete (payload as any).secretaria;

    try {
      await updateServico(payload); // Passa o objeto completo com id
      toast.success("Serviço atualizado com sucesso!");
      navigate("/servicos");
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar serviço");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error || !form) return <p>{error || "Erro ao carregar serviço."}</p>;

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
            value={publicoDestinadoTexto}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Formas de Solicitação:
          <textarea
            name="formasSolicitacao"
            value={formasSolicitacaoTexto}
            onChange={handleChange}
            rows={2}
          />
        </label>

        <label>
          Documentação Necessária:
          <textarea
            name="documentacaoNecessaria"
            value={documentacaoNecessariaTexto}
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
          <select
            name="secretaria"
            value={form?.secretaria?.id?.toString() || ""}
            onChange={(e) => {
              const selected = secretarias.find((s) => s.id === Number(e.target.value));
              if (selected) {
                setForm((prevForm) => ({
                  ...prevForm!,
                  secretaria: selected,
                }));
              }
            }}
          >
            <option value="">Selecione o órgão</option>
            {secretarias.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoria:
          <select
            name="categoria"
            value={form?.categoria?.id?.toString() || ""}
            onChange={(e) => {
              const selected = categorias.find((c) => c.id === Number(e.target.value));
              if (selected) {
                setForm((prevForm) => ({
                  ...prevForm!,
                  categoria: selected,
                }));
              }
            }}
          >
            <option value="">Selecione a categoria</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
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

        <select
          name="persona"
          multiple
          value={form?.persona?.map((p) => String(p.id)) || []}
          onChange={(e) => {
            const selectedIds = Array.from(e.target.selectedOptions, option => Number(option.value));
            const selectedPersonas = persona.filter(p => p.id !== null && selectedIds.includes(p.id));

            setForm({...form!,persona: selectedPersonas});
          }}
        >
          {persona.length === 0 && <option disabled>Carregando...</option>}
          {persona
            .filter(p => p.id !== null)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome}
              </option>
            ))}
        </select>

         <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}