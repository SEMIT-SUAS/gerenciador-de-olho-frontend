import React, { useState } from 'react';
import { categoriaDenunciaSchema } from '../../../schemas/categoriaDenunciaSchema';
import type { FormCategoriaDenuncia } from '../../../types/CategoriaDenuncia';

type Props = {
  aberto: boolean;
  onFechar: () => void;
  onSalvar: (formData: FormData) => Promise<void>;
};

export function CategoriaDenunciaModal({ aberto, onFechar, onSalvar }: Props) {
  const [form, setForm] = useState<FormCategoriaDenuncia>({
    nome: '',
    descricao: '',
    cor: '#000000',
    destaque: false,
    ativo: true,
    visivel: true,
    icone: null,
  });

  const [erros, setErros] = useState<Partial<Record<keyof FormCategoriaDenuncia, string>>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const resultado = categoriaDenunciaSchema.safeParse(form);

    if (!resultado.success) {
      const fieldErrors: Partial<Record<keyof FormCategoriaDenuncia, string>> = {};
      resultado.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as keyof FormCategoriaDenuncia;
          fieldErrors[fieldName] = err.message;
        }
      });
      setErros(fieldErrors);
      return;
    }

    setErros({});

    const formData = new FormData();
    formData.append('nome', form.nome);
    formData.append('descricao', form.descricao);
    formData.append('cor', form.cor);
    formData.append('destaque', String(form.destaque));
    formData.append('ativo', String(form.ativo));
    formData.append('visivel', String(form.visivel));
    formData.append('icone', form.icone!);

    try {
      await onSalvar(formData);
      setForm({
        nome: '',
        descricao: '',
        cor: '#000000',
        destaque: false,
        ativo: true,
        visivel: true,
        icone: null,
      });
      onFechar();
    } catch (error: any) {
      alert('Erro ao criar categoria: ' + error.message);
    }
  }

  if (!aberto) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{ background: '#fff', padding: 20, borderRadius: 8, width: 400 }}
      >
        <h2>Nova Categoria</h2>

        <label>Nome:</label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          required
        />
        {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}

        <label>Descrição:</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          required
        />
        {erros.descricao && <p style={{ color: 'red' }}>{erros.descricao}</p>}

        <label>Cor:</label>
        <input
          type="text"
          value={form.cor}
          placeholder="#000000"
          maxLength={7}
          onChange={(e) => setForm({ ...form, cor: e.target.value })}
        />
        {erros.cor && <p style={{ color: 'red' }}>{erros.cor}</p>}

        <label>Ícone:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setForm({ ...form, icone: e.target.files[0] });
            }
          }}
          required
        />
        {erros.icone && <p style={{ color: 'red' }}>{erros.icone}</p>}

        <label>
          <input
            type="checkbox"
            checked={form.destaque}
            onChange={(e) => setForm({ ...form, destaque: e.target.checked })}
          />
          Destaque
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.visivel}
            onChange={(e) => setForm({ ...form, visivel: e.target.checked })}
          />
          Visível
        </label>

        <label>
          <input
            type="checkbox"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
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
