import { useEffect, useState} from "react";
import { getAllCategorias, createCategoria, editarCategoria, toggleAtivo, toggleVisivel } from '../../services/servicocategoriaService';
import type { ServicoCategoria, createServicoCategoria, ServicoCategoriaEditar } from '../../types/CategoriaServico';
import { toast } from "react-toastify";
import { AddCategoriaForm } from "./components/AddCategoriaForm";
import { EditCategoriaModal } from "./components/EditCategoriaModal";
import { CategoriaItem } from "./components/CategoriaItem";

export function ListaCategorias() {
  const [categorias, setCategorias] = useState<(ServicoCategoria & { id: number })[]>([]);
  const [erro, setErro] = useState('');

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoria, setEditCategoria] = useState<ServicoCategoriaEditar | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const data = await getAllCategorias();
      setCategorias(data);
      //console.log(data);
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
      setCategorias(current =>
        current.map(c =>
          c.id === cat.id ? { ...c, visivel: !c.visivel } : c
        )
      );
    } catch (error) {
      alert(`Erro ao alterar visível: ${(error as Error).message}`);
    }
  }

  async function handleCreateCategoria(nova: createServicoCategoria) {
    try {
      await createCategoria(nova);
      toast.success("Categoria adicionada.");
      setShowAddForm(false);
      fetchCategorias();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  async function handleEditSubmit(updated: ServicoCategoriaEditar) {
    try {
      await editarCategoria(updated);
      toast.success("Categoria editada.");
      setShowEditModal(false);
      setEditCategoria(null);
      fetchCategorias();
    } catch (error) {
      toast.error((error as Error).message);
    }
  }

  if (erro) return <p>{erro}</p>;

  return (
    <div>
      <h2>Categorias</h2>

      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? "Fechar formulário" : "+ Adicionar categoria"}
      </button>

      {showAddForm && (
        <AddCategoriaForm
          onSubmit={handleCreateCategoria}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <ul>
        {categorias.map((cat) => (
          <CategoriaItem
            key={cat.id}
            cat={cat}
            onToggleAtivo={handleToggleAtivo}
            onToggleVisivel={handleToggleVisivel}
            onEdit={() => {
              setEditCategoria({ id: cat.id, nome: cat.nome, icone: cat.icone });
              setShowEditModal(true);
            }}
          />
        ))}
      </ul>

      {showEditModal && editCategoria && (
        <EditCategoriaModal
          categoria={editCategoria}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
        />
      )}
    </div>
  );
}