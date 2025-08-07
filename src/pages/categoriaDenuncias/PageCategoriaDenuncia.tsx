import { useEffect, useState } from 'react';
import type { GetCategoriaDenuncia } from '../../types/CategoriaDenuncia';
import {getAll,changeCategoriaDenunciaVisibility,changeCategoriaDenunciaAtivo,createCategoriaDenuncia,} from '../../services/categoriaDenunciaService';
import { CategoriaDenunciaModal } from './components/CategoriaDenunciaModal';

export function ListaCategoriaDenuncia() {
  const [categorias, setCategorias] = useState<GetCategoriaDenuncia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const resultado = await getAll();
        setCategorias(resultado);
      } catch (err: any) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }
    fetchCategorias();
  }, []);

  async function toggleVisibilidade(id: number, visivelAtual: boolean) {
    try {
      const novoVisivel = !visivelAtual;
      await changeCategoriaDenunciaVisibility(id, novoVisivel);
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, visivel: novoVisivel } : cat
        )
      );
    } catch (err: any) {
      alert('Erro ao alterar visibilidade: ' + err.message);
    }
  }

  async function toggleAtividade(id: number, ativoAtual: boolean) {
    try {
      const novoAtivo = !ativoAtual;
      await changeCategoriaDenunciaAtivo(id, novoAtivo);
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, ativo: novoAtivo } : cat
        )
      );
    } catch (err: any) {
      alert('Erro ao alterar atividade: ' + err.message);
    }
  }

  async function handleSalvar(formData: FormData) {
    await createCategoriaDenuncia(formData);
    setModalAberto(false);
    const atualizadas = await getAll();
    setCategorias(atualizadas);
  }

  if (carregando) return <p>Carregando categorias...</p>;
  if (erro) return <p style={{ color: 'red' }}>{erro}</p>;
  if (categorias.length === 0) return <p>Nenhuma categoria encontrada.</p>;

  return (
    <>
      <button
        style={{ marginBottom: '1rem', padding: '10px 20px' }}
        onClick={() => setModalAberto(true)}
      >
        Nova Categoria
      </button>

      <CategoriaDenunciaModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {categorias.map((categoria) => (
          <div
            key={categoria.id}
            style={{
              backgroundColor: '#f0f0f0',
              color: '#000',
              padding: '16px',
              borderRadius: '8px',
              width: '250px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <h3>{categoria.nome}</h3>
            <p>{categoria.descricao}</p>

            {categoria.icone && (
              <img
                src={categoria.icone}
                alt={`Ícone de ${categoria.nome}`}
                style={{
                  width: '40px',
                  height: '40px',
                  objectFit: 'contain',
                  border: '1px solid red',
                }}
              />
            )}

            {categoria.destaque && <p>🌟 Destaque</p>}

            <p>Visível: {categoria.visivel ? 'Sim' : 'Não'}</p>
            <p>Ativo: {categoria.ativo ? 'Sim' : 'Não'}</p>

            <button
              onClick={() => toggleVisibilidade(categoria.id, categoria.visivel)}
              style={{
                marginTop: '8px',
                padding: '8px 12px',
                backgroundColor: categoria.visivel ? 'red' : 'green',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '8px',
              }}
            >
              {categoria.visivel ? 'Ocultar' : 'Exibir'}
            </button>

            <button
              onClick={() => toggleAtividade(categoria.id, categoria.ativo)}
              style={{
                padding: '8px 12px',
                backgroundColor: categoria.ativo ? '#555' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              {categoria.ativo ? 'Desativar' : 'Ativar'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
