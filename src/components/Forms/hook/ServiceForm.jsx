import React from 'react';
import type { Services } from '../../types/Services';
import type { Secretaria } from '../../types/Secretaria';
import type { ServicoCategoria } from '../../types/CategoriaServico';
import type { Persona } from '../../types/Persona';

interface ServiceFormProps {
  form: Services;
  secretarias: Secretaria[];
  categorias: ServicoCategoria[];
  personas: Persona[];
  saving: boolean;
  mode: 'create' | 'edit';
  onSubmit: (e: React.FormEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
}

export function ServiceForm({
  form,
  secretarias,
  categorias,
  personas,
  saving,
  mode,
  onSubmit,
  onChange,
}: ServiceFormProps) {
  return (
    <form onSubmit={onSubmit} className="service-form">
      {/* Campos básicos */}
      <label>
        Nome:
        <input
          type="text"
          name="nome"
          value={form.nome}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Descrição:
        <textarea
          name="descricao"
          value={form.descricao}
          onChange={onChange}
          required
          rows={3}
        />
      </label>

      <label>
        Público Destinado:
        <textarea
          name="publicoDestinado"
          value={form.publicoDestinado.join('\n')}
          onChange={onChange}
          rows={3}
          placeholder="Digite um item por linha"
        />
      </label>

      <label>
        Formas de Solicitação:
        <textarea
          name="formasSolicitacao"
          value={form.formasSolicitacao.join('\n')}
          onChange={onChange}
          rows={3}
          placeholder="Digite um item por linha"
        />
      </label>

      <label>
        Documentação Necessária:
        <textarea
          name="documentacaoNecessaria"
          value={form.documentacaoNecessaria.join('\n')}
          onChange={onChange}
          rows={4}
          placeholder="Digite um item por linha"
        />
      </label>

      <label>
        Custos:
        <input
          type="text"
          name="custos"
          value={form.custos}
          onChange={onChange}
        />
      </label>

      <label>
        Etapas:
        <textarea
          name="etapas"
          value={form.etapas}
          onChange={onChange}
          rows={2}
        />
      </label>

      <label>
        Requisitos:
        <textarea
          name="requisitos"
          value={form.requisitos}
          onChange={onChange}
          rows={2}
        />
      </label>

      <label>
        Formas de Acompanhamento:
        <textarea
          name="formasAcompanhamento"
          value={form.formasAcompanhamento}
          onChange={onChange}
          rows={2}
        />
      </label>

      <label>
        Prazo de Atendimento:
        <input
          type="text"
          name="prazoAtendimento"
          value={form.prazoAtendimento}
          onChange={onChange}
        />
      </label>

      <label>
        Prioridades:
        <textarea
          name="prioridades"
          value={form.prioridades}
          onChange={onChange}
          rows={2}
        />
      </label>

      <label>
        Horário de Atendimento:
        <input
          type="text"
          name="horarioAtendimento"
          value={form.horarioAtendimento}
          onChange={onChange}
        />
      </label>

      <label>
        Legislação:
        <textarea
          name="legislacao"
          value={form.legislacao}
          onChange={onChange}
          rows={2}
        />
      </label>

      {/* Campos que mudam baseado no modo */}
      {mode === 'create' ? (
        <>
          <label>
            Secretaria:
            <select
              name="secretaria"
              value={form.secretaria ? form.secretaria.id : ''}
              onChange={onChange}
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
              onChange={onChange}
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : (
        <>
          <label>
            Órgão:
            <input
              type="text"
              name="orgao.nome"
              value={form.orgao?.nome || ''}
              onChange={onChange}
            />
          </label>

          <label>
            Categoria:
            <input
              type="text"
              name="categoria.nome"
              value={form.categoria?.nome || ''}
              onChange={onChange}
            />
          </label>
        </>
      )}

      <label>
        Setor de Lotação:
        <input
          type="text"
          name="setorLotacao"
          value={form.setorLotacao}
          onChange={onChange}
        />
      </label>

      <label>
        Modelo de Requerimento:
        <input
          type="text"
          name="modeloRequerimento"
          value={form.modeloRequerimento}
          onChange={onChange}
        />
      </label>

      {/* Campo Persona */}
      {mode === 'create' ? (
        <label>
          Persona:
          <select
            name="persona"
            multiple
            value={form.persona.map((p) => String(p.id))}
            onChange={onChange}
            style={{ minHeight: '100px' }}
          >
            {personas.length === 0 && <option disabled>Carregando...</option>}
            {personas
              .filter((p) => p.id !== null)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
          </select>
          <small>Segure Ctrl/Cmd para selecionar múltiplas opções</small>
        </label>
      ) : (
        <label>
          Persona:
          <input
            type="text"
            name="persona"
            value={form.persona.map(p => p.nome).join(', ')}
            onChange={onChange}
            placeholder="Lista de personas separadas por vírgula"
          />
        </label>
      )}

      {/* Checkboxes */}
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="visivel"
          checked={form.visivel}
          onChange={onChange}
        />
        Visível
      </label>

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="ativo"
          checked={form.ativo}
          onChange={onChange}
        />
        Ativo
      </label>

      {/* Botão de submit */}
      <button type="submit" disabled={saving} className="submit-button">
        {saving 
          ? 'Salvando...' 
          : mode === 'create' 
            ? 'Criar Serviço' 
            : 'Salvar Alterações'
        }
      </button>

      <style jsx>{`
        .service-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        label {
          display: flex;
          flex-direction: column;
          font-weight: 600;
          color: #333;
        }

        label.checkbox-label {
          flex-direction: row;
          align-items: center;
          gap: 8px;
        }

        input[type="text"],
        textarea,
        select {
          font-size: 16px;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #ddd;
          margin-top: 4px;
          transition: border-color 0.2s;
        }

        input[type="text"]:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        small {
          color: #666;
          font-weight: normal;
          margin-top: 4px;
          font-size: 14px;
        }

        .submit-button {
          margin-top: 24px;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background-color: #3b82f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-button:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .submit-button:disabled {
          background-color: #94a3b8;
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}