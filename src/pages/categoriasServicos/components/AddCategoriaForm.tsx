import { useState, type FormEvent, type ChangeEvent } from "react";
import type { createServicoCategoria } from "../../../types/CategoriaServico";
import { categoriaSchema } from "../../../schemas/categoriaSchema"; // ajuste o caminho
import { z } from "zod";
import { toast } from "react-toastify";

interface Props {
  onSubmit: (nova: createServicoCategoria) => void;
  onCancel: () => void;
}

export function AddCategoriaForm({ onSubmit, onCancel }: Props) {
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState<File | null>(null);
  const [ativo, setAtivo] = useState(true);
  const [visivel, setVisivel] = useState(true);
  const [erros, setErros] = useState<Partial<Record<keyof createServicoCategoria, string>>>({});

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setIcone(e.target.files[0]);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const dados = { nome, icone, ativo, visivel };

    try {
      categoriaSchema.parse(dados);
      setErros({});
      onSubmit(dados);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof createServicoCategoria, string>> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof createServicoCategoria;
          fieldErrors[field] = err.message;
        });
        setErros(fieldErrors);
        toast.error("Preencha os campos corretamente.");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ margin: "1rem 0" }}>
      <div>
        <label>Nome:
          <input
            type="text"
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
          />
        </label>
        {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
      </div>

      <div>
        <label>Ícone:
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </label>
        {icone && <p>Arquivo: {icone.name}</p>}
        {erros.icone && <p style={{ color: 'red' }}>{erros.icone}</p>}
      </div>

      <div>
        <label>Ativo:
          <input type="checkbox" checked={ativo} onChange={e => setAtivo(e.target.checked)} />
        </label>
      </div>

      <div>
        <label>Visível:
          <input type="checkbox" checked={visivel} onChange={e => setVisivel(e.target.checked)} />
        </label>
      </div>

      <button type="submit">Salvar</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '0.5rem' }}>
        Cancelar
      </button>
    </form>
  );
}
