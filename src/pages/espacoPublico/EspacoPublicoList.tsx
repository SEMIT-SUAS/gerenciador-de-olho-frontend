import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEspacoPublico, changeEspacoPublicoAtivo, changeEspacoPublicoVisibility } from "../../services/EspacoPublico";
import type { EspacoPublico } from "../../types/EspacoPublico";
import { EspacoPublicoItem } from "./components/EspacoPublicoItem";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { styles } from "./components/styles";

export function EspacoPublicoList() {
  const [espacos, setEspacos] = useState<EspacoPublico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEspacos() {
      try {
        const dados = await getAllEspacoPublico();
        setEspacos(dados);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar espaços públicos.");
      } finally {
        setLoading(false);
      }
    }

    fetchEspacos();
  }, []);

  const irParaCadastro = () => {
    navigate("/espaco-publico-cadastrar");
  };

  const irParaEditar = (id: number) => {
    navigate(`/espaco-publico-editar/${id}`);
  };

  const toggleVisibilidade = async (id: number, visivelAtual: boolean) => {
    try {
      const novoVisivel = !visivelAtual;
      await changeEspacoPublicoVisibility(id, novoVisivel);

      setEspacos((prev) =>
        prev.map((espaco) =>
          espaco.id === id ? { ...espaco, visivel: novoVisivel } : espaco
        )
      );
    } catch (err: any) {
      alert(err.message || "Erro ao alterar visibilidade.");
    }
  };

  const toggleAtivo = async (id: number, ativoAtual: boolean) => {
    try {
      const novoAtivo = !ativoAtual;
      await changeEspacoPublicoAtivo(id, novoAtivo);

      setEspacos((prev) =>
        prev.map((espaco) =>
          espaco.id === id ? { ...espaco, ativo: novoAtivo } : espaco
        )
      );
    } catch (err: any) {
      alert(err.message || "Erro ao alterar status de atividade.");
    }
  };

  if (loading) return <Loader />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Espaços Públicos</h2>
        <button onClick={irParaCadastro} style={styles.button}>
          + Cadastrar Espaço
        </button>
      </div>

      {espacos.length === 0 ? (
        <p>Nenhum espaço público encontrado.</p>
      ) : (
        <ul style={styles.list}>
          {espacos.map((espaco) => (
            <EspacoPublicoItem
              key={espaco.id}
              espaco={espaco}
              onToggleVisivel={toggleVisibilidade}
              onToggleAtivo={toggleAtivo}
              onEdit={irParaEditar}
            />
          ))}
        </ul>
      )}
    </div>
  );
}