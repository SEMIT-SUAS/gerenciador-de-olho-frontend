import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateService } from '../../types/Services';
import { createService } from '../../services/servicosServices';
import secretariaService from '../../services/secretariaService'; // ajuste o caminho se necessário
import type { SecretariaModel } from '../../types/Secretaria';
import { getAllCategorias } from '../../services/servicocategoriaService';
import type { ServicoCategoria } from '../../types/CategoriaServico';
import { getAllPerosona } from '../../services/servicoPersona';
import type { Persona } from '../../types/Persona';
import { Input } from '@/components/ui/input';

function parseMultilineInput(text: string): string[] {
  return text
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter((line) => line !== '');
}

export function ServicoNovo() {
  const navigate = useNavigate();

  const [form, setForm] = useState<CreateService>({
    id: null,
    orgao: null,
    secretaria: null,
    nome: '',
    descricao: '',
    publicoDestinado: [],
    formasSolicitacao: [],
    documentacaoNecessaria: [],
    custos: '',
    etapas: '',
    requisitos: '',
    formasAcompanhamento: '',
    prazoAtendimento: '',
    prioridades: '',
    horarioAtendimento: '',
    legislacao: '',
    categoria: null,
    setorLotacao: '',
    modeloRequerimento: '',
    persona: [],
    visivel: true,
    ativo: true,
  });

  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);
  const [persona, setPersona] = useState<Persona[]>([]);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [secretariasData, categoriasData, personaData] =
          await Promise.all([
            secretariaService.getAll(),
            getAllCategorias(),
            getAllPerosona(),
          ]);
        setSecretarias(secretariasData);
        setCategorias(categoriasData);
        setPersona(personaData);

        console.log(personaData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    fetchDados();
  }, []);

  useEffect(() => {
    console.log('form.persona:', form.persona);
  }, [form.persona]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    // Checkbox ou radio para campos booleanos
    if (
      (name === 'visivel' || name === 'ativo') &&
      e.target instanceof HTMLInputElement &&
      (e.target.type === 'checkbox' || e.target.type === 'radio')
    ) {
      setForm({ ...form, [name]: e.target.checked });
      return;
    }

    // Campos objeto: categoria.nome
    if (name === 'categoria') {
      const selectedCategoria = categorias.find(
        (cat) => cat.id === Number(value),
      );
      if (selectedCategoria) {
        setForm({ ...form, categoria: selectedCategoria });
      } else {
        // Se quiser permitir limpar seleção
        setForm({ ...form, categoria: null });
      }
      return;
    }
    if (
      name === 'publicoDestinado' ||
      name === 'formasSolicitacao' ||
      name === 'documentacaoNecessaria' ||
      name === 'persona'
    ) {
      setForm({ ...form, [name]: parseMultilineInput(value) });
      return;
    }

    // Campo objeto: secretaria (espera um objeto completo, mas o select retorna só o id)
    if (name === 'secretaria') {
      // Busca o objeto completo da secretaria no array de secretarias pelo id selecionado
      const selectedSecretaria = secretarias.find(
        (sec) => sec.id === Number(value),
      );
      if (selectedSecretaria) {
        setForm({ ...form, secretaria: selectedSecretaria });
      }
      return;
    }

    if (name === 'persona') {
      const selectedId = Number(value);

      // Verifica se o ID já está no array
      const exists = form.persona.some((p) => p.id === selectedId);

      if (exists) {
        // Remove se já existe
        const updated = form.persona.filter((p) => p.id !== selectedId);
        setForm({ ...form, persona: updated });
      } else {
        // Adiciona se ainda não existe
        const selected = persona.find((p) => p.id === selectedId);
        if (selected) {
          setForm({ ...form, persona: [...form.persona, selected] });
        }
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
      const payload = {
        ...form,
        orgao: form.secretaria?.id ?? null,
        categoria: form.categoria?.id ?? null,
        personas: form.persona.map((p) => p.id), // [1, 3, 5]  // array de ids para o backend
      };

      console.log('Dados enviados para o backend:', payload);

      // Remove o campo secretaria do payload, se existir
      delete (payload as any).secretaria;

      await createService(payload);
      navigate('/'); // redireciona após sucesso
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Adicionar Novo Serviço</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <Input
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
            value={form.publicoDestinado.join('\n')}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Formas de Solicitação:
          <textarea
            name="formasSolicitacao"
            value={form.formasSolicitacao.join('\n')}
            onChange={handleChange}
            rows={3}
          />
        </label>

        <label>
          Documentação Necessária:
          <textarea
            name="documentacaoNecessaria"
            value={form.documentacaoNecessaria.join('\n')}
            onChange={handleChange}
            rows={4}
          />
        </label>

        <label>
          Custos:
          <Input
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
          <Input
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
          <Input
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
          Secretaria:
          <select
            name="secretaria"
            value={form.secretaria ? form.secretaria.id : ''}
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
          <select
            name="categoria"
            value={form.categoria ? form.categoria.id : ''}
            onChange={handleChange}
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Setor de Lotação:
          <Input
            type="text"
            name="setorLotacao"
            value={form.setorLotacao}
            onChange={handleChange}
          />
        </label>

        <label>
          Modelo de Requerimento:
          <Input
            type="text"
            name="modeloRequerimento"
            value={form.modeloRequerimento}
            onChange={handleChange}
          />
        </label>

        <label>
          Persona:
          <select
            name="persona"
            multiple
            value={form.persona.map((p) => String(p.id))}
            onChange={(e) => {
              const selectedIds = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value),
              );
              const selectedPersonas = persona.filter(
                (p) => p.id !== null && selectedIds.includes(p.id),
              );
              console.log('IDs selecionados:', selectedIds);
              console.log('Personas selecionadas:', selectedPersonas);

              setForm({ ...form, persona: selectedPersonas });
            }}
          >
            {persona.length === 0 && <option disabled>Carregando...</option>}
            {persona
              .filter((p) => p.id !== null)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
          </select>
        </label>

        <label>
          Visível:
          <Input
            type="checkbox"
            name="visivel"
            checked={form.visivel}
            onChange={handleChange}
          />
        </label>

        <label>
          Ativo:
          <Input
            type="checkbox"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
          />
        </label>

        <button type="submit" disabled={loading} style={{ marginTop: 20 }}>
          {loading ? 'Salvando...' : 'Salvar Serviço'}
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
