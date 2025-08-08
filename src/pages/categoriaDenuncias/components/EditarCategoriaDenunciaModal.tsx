import React, { useState, useEffect } from 'react';
import type { GetCategoriaDenuncia } from '../../../types/CategoriaDenuncia';

type Props = {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (formData: FormData) => Promise<void>;
  categoria: GetCategoriaDenuncia;
};

export function EditarCategoriaDenunciaModal({ aberto, onFechar, onSalvar, categoria }: Props) {
  const [nome, setNome] = useState(categoria.nome);
  const [descricao, setDescricao] = useState(categoria.descricao);
  const [cor, setCor] = useState(categoria.cor);
  const [destaque, setDestaque] = useState(categoria.destaque);
  const [ativo, setAtivo] = useState(categoria.ativo);
  const [visivel, setVisivel] = useState(categoria.visivel);
  const [icone, setIcone] = useState<File | null>(null);
  const [iconePreview, setIconePreview] = useState<string | null>(categoria.icone || null);

  useEffect(() => {
    // Atualiza estados se categoria mudar (ex: modal aberto para outra categoria)
    setNome(categoria.nome);
    setDescricao(categoria.descricao);
    setCor(categoria.cor);
    setDestaque(categoria.destaque);
    setAtivo(categoria.ativo);
    setVisivel(categoria.visivel);
    setIcone(null);
    setIconePreview(categoria.icone || null);
  }, [categoria]);

  if (!aberto) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('id', String(categoria.id));
    formData.append('nome', nome);
    formData.append('descricao', descricao);
    formData.append('cor', cor);
    formData.append('destaque', String(destaque));
    formData.append('ativo', String(ativo));
    formData.append('visivel', String(visivel));
    if (icone) {
      formData.append('icone', icone);
    }

    try {
      await onSalvar(formData);
    } catch (error: any) {
      alert('Erro ao salvar categoria: ' + error.message);
    }
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999,
    }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', padding: 20, borderRadius: 8, width: 400 }}
      >
        <h2>Editar Categoria</h2>

        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={e => setNome(e.target.value)}
          required
        />

        <label>Descrição:</label>
        <textarea
          value={descricao}
          onChange={e => setDescricao(e.target.value)}
          required
        />

        <label>Cor:</label>
        <input
          type="text"
          value={cor}
          placeholder="#000000"
          maxLength={7}
          onChange={e => setCor(e.target.value)}
        />

        <label>Ícone:</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => {
            if (e.target.files?.[0]) {
              setIcone(e.target.files[0]);
              setIconePreview(URL.createObjectURL(e.target.files[0]));
            }
          }}
        />
        {iconePreview && (
          <img
            src={iconePreview}
            alt="Preview ícone"
            style={{ width: 40, height: 40, objectFit: 'contain', border: '1px solid #ccc', marginTop: 8 }}
          />
        )}

        <label>
          <input
            type="checkbox"
            checked={destaque}
            onChange={e => setDestaque(e.target.checked)}
          />
          Destaque
        </label>

        <label>
          <input
            type="checkbox"
            checked={visivel}
            onChange={e => setVisivel(e.target.checked)}
          />
          Visível
        </label>

        <label>
          <input
            type="checkbox"
            checked={ativo}
            onChange={e => setAtivo(e.target.checked)}
          />
          Ativo
        </label>

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
          <button type="submit">Salvar</button>
          <button type="button" onClick={onFechar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
