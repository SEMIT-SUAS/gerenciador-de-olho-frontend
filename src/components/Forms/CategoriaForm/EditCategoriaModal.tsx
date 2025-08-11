import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { ServicoCategoriaEditar } from '../../../types/CategoriaServico';
import { categoriaEditarSchema } from './CategoriaSchema';
import { z } from 'zod';
import { toast } from 'react-toastify';

interface Props {
  categoria: ServicoCategoriaEditar;
  onClose: () => void;
  onSubmit: (cat: ServicoCategoriaEditar) => void;
}

export function EditCategoriaModal({ categoria, onClose, onSubmit }: Props) {
  const [editCategoria, setEditCategoria] =
    useState<ServicoCategoriaEditar>(categoria);
  const [erros, setErros] = useState<
    Partial<Record<keyof ServicoCategoriaEditar, string>>
  >({});

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setEditCategoria((prev) => ({
        ...prev,
        icone: e.target.files![0],
      }));
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    try {
      categoriaEditarSchema.parse(editCategoria);
      setErros({});
      onSubmit(editCategoria);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<
          Record<keyof ServicoCategoriaEditar, string>
        > = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as keyof ServicoCategoriaEditar;
          fieldErrors[field] = err.message;
        });
        setErros(fieldErrors);
        toast.error('Preencha os campos corretamente.');
      }
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '300px',
        }}
      >
        <h3>Editar Categoria</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Nome:
              <input
                type="text"
                value={editCategoria.nome}
                onChange={(e) =>
                  setEditCategoria({ ...editCategoria, nome: e.target.value })
                }
                required
              />
            </label>
            {erros.nome && <p style={{ color: 'red' }}>{erros.nome}</p>}
          </div>

          <div>
            <label>
              Ícone:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            {editCategoria.icone && typeof editCategoria.icone !== 'string' && (
              <p>Arquivo: {editCategoria.icone.name}</p>
            )}
            {erros.icone && <p style={{ color: 'red' }}>{erros.icone}</p>}
          </div>

          <button type="submit">Salvar</button>
          <button
            type="button"
            onClick={onClose}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
