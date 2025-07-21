import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Services } from "../../types/Services";
import { createService } from "../../services/servicosServices";
import { getAllSecretarias } from '../../services/secretariaService'; // ajuste o caminho se necessário
import type { Secretaria } from "../../types/Secretaria";

export function ServicoNovo() {
  const navigate = useNavigate();

  const [form, setForm] = useState<Services>({
    orgao: "",
    secretaria: null,
    nome: "",
    descricao: "",
    publicoDestinado: "",
    formasSolicitacao: "",
    documentacaoNecessaria: "",
    custos: "",
    etapas: "",
    requisitos: "",
    formasAcompanhamento: "",
    prazoAtendimento: "",
    prioridades: "",
    horarioAtendimento: "",
    legislacao: "",
    categoria: { nome: "" },
    setorLotacao: "",
    modeloRequerimento: "",
    persona: "",
    visivel: true,
    ativo: true,
  });

  const [categorias, setCategorias] = useState<{ nome: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);

  useEffect(() => {
  async function fetchSecretarias() {
    try {
      const secretariasData = await getAllSecretarias();
      setSecretarias(secretariasData);
    } catch (error) {
      console.error("Erro ao buscar secretarias:", error);
    }
  }

  fetchSecretarias();
}, []);

  function handleChange(
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >
) {
  const { name, value } = e.target;

  // Checkbox ou radio para campos booleanos
  if (
    (name === "visivel" || name === "ativo") &&
    e.target instanceof HTMLInputElement &&
    (e.target.type === "checkbox" || e.target.type === "radio")
  ) {
    setForm({ ...form, [name]: e.target.checked });
    return;
  }

  // Campos objeto: categoria.nome
  if (name === "categoria.nome") {
    setForm({ ...form, categoria: { nome: value } });
    return;
  }

  // Campo objeto: secretaria (espera um objeto completo, mas o select retorna só o id)
  if (name === "secretaria") {
    // Busca o objeto completo da secretaria no array de secretarias pelo id selecionado
    const selectedSecretaria = secretarias.find(
      (sec) => sec.id === Number(value)
    );
    if (selectedSecretaria) {
      setForm({ ...form, secretaria: selectedSecretaria });
    }
    return;
  }

  // Caso padrão para os outros inputs (texto, textarea, select simples)
  setForm({ ...form, [name]: value });
}

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Cria um novo objeto com os dados do formulário
    const payload = {
      ...form,
      orgao: form.secretaria?.id, // backend espera só o id da secretaria
    };

    // Remove o campo secretaria do payload, se existir
    delete (payload as any).secretaria;

    await createService(payload);
    navigate("/"); // redireciona após sucesso
  } catch (err: any) {
    setError(err.message || "Erro inesperado");
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>Adicionar Novo Serviço</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

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
          <input type="text" name="custos" value={form.custos} onChange={handleChange} />
        </label>

        <label>
          Etapas:
          <textarea name="etapas" value={form.etapas} onChange={handleChange} rows={2} />
        </label>

        <label>
          Requisitos:
          <textarea name="requisitos" value={form.requisitos} onChange={handleChange} rows={2} />
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
          <textarea name="prioridades" value={form.prioridades} onChange={handleChange} rows={2} />
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
          <textarea name="legislacao" value={form.legislacao} onChange={handleChange} rows={2} />
        </label>

        <label>
          Secretaria:
          <select
            name="secretaria"
            value={form.secretaria ? form.secretaria.id : ""}
            onChange={handleChange}
          >
            <option value="">Selecione uma secretaria</option>
            {secretarias.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoria:
          <select name="categoria.nome" value={form.categoria.nome} onChange={handleChange}>
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat.nome}>
                {cat.nome}
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

        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? "Salvando..." : "Salvar Serviço"}
        </button>
      </form>

      <style>{`
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
        }
        input[type="text"],
        textarea {
          font-size: 1rem;
          padding: 6px;
          border-radius: 4px;
          border: 1px solid #ccc;
        }
      `}</style>
    </div>
  );
}