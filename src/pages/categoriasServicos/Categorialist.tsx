import { useEffect, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  getAllCategorias,
  createCategoria,
  editarCategoria,
  toggleAtivo,
  toggleVisivel,
} from '../../services/servicocategoriaService';
import type { ServicoCategoria } from '../../types/CategoriaServico';
import type { ServicoCategoriaEditar } from '../../types/ServicoCategoriaEditar';

export function ListaCategorias() {
  const [categorias, setCategorias] = useState<
    (ServicoCategoria & { id: number })[]
  >([]);
  const [erro, setErro] = useState('');

  // Formulário de adicionar
  const [showAddForm, setShowAddForm] = useState(false);
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState<File | null>(null);
  const [ativo, setAtivo] = useState(true);
  const [visivel, setVisivel] = useState(true);

  // Modal de edição
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoria, setEditCategoria] =
    useState<ServicoCategoriaEditar | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const data = await getAllCategorias();
      setCategorias(data);
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function handleToggleAtivo(cat: ServicoCategoria & { id: number }) {
    try {
      await toggleAtivo(cat.id, !cat.ativo);
      fetchCategorias();
    } catch (error) {
      alert(`Erro ao alterar ativo: ${(error as Error).message}`);
    }
  }

  async function handleToggleVisivel(cat: ServicoCategoria & { id: number }) {
    try {
      await toggleVisivel(cat.id, !cat.visivel);

      // Atualiza localmente o estado para não remover da lista
      setCategorias((current) =>
        current.map((c) =>
          c.id === cat.id ? { ...c, visivel: !c.visivel } : c,
        ),
      );
    } catch (error) {
      alert(`Erro ao alterar visível: ${(error as Error).message}`);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>, isEdit = false) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (isEdit && editCategoria) {
        setEditCategoria({ ...editCategoria, icone: file });
      } else {
        setIcone(file);
      }
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nome || !icone) {
      alert('Preencha todos os campos.');
      return;
    }

    try {
      const nova: ServicoCategoria = { nome, icone, ativo, visivel };
      await createCategoria(nova);
      alert('Categoria adicionada.');
      setShowAddForm(false);
      resetForm();
      fetchCategorias();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editCategoria || !editCategoria.nome) return;

    try {
      await editarCategoria(editCategoria);

      alert('Categoria editada com sucesso.');
      setShowEditModal(false);
      setEditCategoria(null);
      fetchCategorias();
    } catch (error) {
      alert((error as Error).message);
    }
  }

  function resetForm() {
    setNome('');
    setIcone(null);
    setAtivo(true);
    setVisivel(true);
  }

  if (erro) return <p>{erro}</p>;

  return (
    <div>
      <h2>Categorias</h2>

      <button onClick={() => setShowAddForm(!showAddForm)}>
        + Adicionar categoria
      </button>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          style={{ marginTop: '1rem', marginBottom: '1rem' }}
        >
          <div>
            <label>
              Nome:{' '}
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Ícone:{' '}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e)}
                required
              />
            </label>
            {icone && <p>Arquivo: {icone.name}</p>}
          </div>
          <div>
            <label>
              Ativo:{' '}
              <input
                type="checkbox"
                checked={ativo}
                onChange={(e) => setAtivo(e.target.checked)}
              />
            </label>
          </div>
          <div>
            <label>
              Visível:{' '}
              <input
                type="checkbox"
                checked={visivel}
                onChange={(e) => setVisivel(e.target.checked)}
              />
            </label>
          </div>
          <button type="submit">Salvar</button>
          <button
            type="button"
            onClick={() => setShowAddForm(false)}
            style={{ marginLeft: '0.5rem' }}
          >
            Cancelar
          </button>
        </form>
      )}

      <ul>
        {categorias.map((cat) => {
          const src =
            typeof cat.icone === 'string'
              ? cat.icone
              : cat.icone instanceof File
              ? URL.createObjectURL(cat.icone)
              : '';

          return (
            <li
              key={cat.id}
              style={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <img
                src={src}
                alt={cat.nome}
                width="40"
                style={{ marginRight: '10px' }}
              />
              <span style={{ flexGrow: 1 }}>{cat.nome}</span>

              <button
                onClick={() => handleToggleAtivo(cat)}
                style={{ marginRight: '5px' }}
              >
                {cat.ativo ? 'Desativar' : 'Ativar'}
              </button>

              <button
                onClick={() => handleToggleVisivel(cat)}
                style={{ marginRight: '5px' }}
              >
                {cat.visivel ? 'Ocultar' : 'Mostrar'}
              </button>

              <button
                onClick={() => {
                  setEditCategoria({
                    id: cat.id,
                    nome: cat.nome,
                    icone: undefined,
                  });
                  setShowEditModal(true);
                }}
              >
                Editar
              </button>
            </li>
          );
        })}
      </ul>

      {/* Modal de edição */}
      {showEditModal && editCategoria && (
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
            <form onSubmit={handleEditSubmit}>
              <div>
                <label>
                  Nome:
                  <input
                    type="text"
                    value={editCategoria.nome}
                    onChange={(e) =>
                      setEditCategoria({
                        ...editCategoria,
                        nome: e.target.value,
                      })
                    }
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Ícone:
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, true)}
                  />
                </label>
              </div>
              <button type="submit">Salvar</button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                style={{ marginLeft: '0.5rem' }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
