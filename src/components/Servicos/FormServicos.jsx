

export function FormServicos() {
    return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Detalhes do Serviço</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

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
          {loading ? 'Salvando...' : 'Salvar Serviço'}
        </button>
      </form>
    </div>  
  );
}