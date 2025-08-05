import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { EspacoPublicoById } from "../../types/EspacoPublico";
import { getEspacoPublicoById, updateEspacoPublico } from "../../services/EspacoPublico";

export function EspacoPublicoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Estado para guardar as URLs das imagens já salvas no servidor
  const [imagensExistentes, setImagensExistentes] = useState<string[]>([]);

  // Função para remover uma imagem da lista local
    function removerImagem(index: number) {
    setImagensExistentes((imgs) => imgs.filter((_, i) => i !== index));
    }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<EspacoPublicoById>();

  // Arquivos que o usuário selecionou agora (FileList)
  const arquivosSelecionados = watch("arquivos");

  useEffect(() => {
    async function fetchData() {
      try {
        if (!id) return;
        const espaco = await getEspacoPublicoById(parseInt(id));
        reset(espaco);

        // Supondo que espaco.arquivos seja um array de URLs (string[])
        if (Array.isArray(espaco.arquivos)) {
          setImagensExistentes(espaco.arquivos);
        } else {
          setImagensExistentes([]);
        }

      } catch (err: any) {
        toast.error(err.message || "Erro ao carregar os dados.");
      }
    }

    fetchData();
  }, [id, reset]);

  const onSubmit = async (data: EspacoPublicoById) => {
    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("nome", data.nome);
      formData.append("estado", data.estado);
      formData.append("cidade", data.cidade);
      formData.append("bairro", data.bairro);
      formData.append("rua", data.rua);
      formData.append("latitude", String(data.latitude));
      formData.append("longitude", String(data.longitude));
      formData.append("capacidade_maxima", String(data.capacidadeMaxima ?? ""));
      formData.append("hora_inicio", data.horaInicio);
      formData.append("hora_fim", data.horaFim);
      formData.append("visivel", String(data.visivel));
      formData.append("ativo", String(data.ativo));
      formData.append("id", String(data.id));

      // Adiciona os arquivos novos (se houver)
      if (data.arquivos instanceof FileList && data.arquivos.length > 0) {
        Array.from(data.arquivos).forEach((file) => {
          formData.append("arquivos", file);
        });
      }

      await updateEspacoPublico(formData);

      toast.success("Espaço atualizado com sucesso!");
      navigate("/espaco-publico");
    } catch (error: any) {
      toast.error(error.message || "Erro ao atualizar espaço público.");
    } finally {
      setLoading(false);
    }
  };

  // Função para mostrar preview dos arquivos selecionados (FileList)
  const renderArquivosSelecionados = () => {
    if (!(arquivosSelecionados instanceof FileList)) return null;
    if (arquivosSelecionados.length === 0) return null;

    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        {Array.from(arquivosSelecionados).map((file, index) => {
          const url = URL.createObjectURL(file);
          return (
            <img
              key={index}
              src={url}
              alt={`Imagem nova ${index + 1}`}
              style={{
                width: "150px",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
              }}
              onLoad={() => URL.revokeObjectURL(url)} // libera memória após carregar
            />
          );
        })}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Editar Espaço Público</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input placeholder="Nome" {...register("nome", { required: "Nome obrigatório" })} style={styles.input} />
        {errors.nome && <p style={styles.error}>{errors.nome.message}</p>}

        <input placeholder="Estado" {...register("estado", { required: "Estado obrigatório" })} style={styles.input} />
        <input placeholder="Cidade" {...register("cidade")} style={styles.input} />
        <input placeholder="Bairro" {...register("bairro")} style={styles.input} />
        <input placeholder="Rua" {...register("rua")} style={styles.input} />

        <input type="number" step="any" placeholder="Latitude" {...register("latitude", { valueAsNumber: true })} style={styles.input} />
        <input type="number" step="any" placeholder="Longitude" {...register("longitude", { valueAsNumber: true })} style={styles.input} />

        <input type="number" placeholder="Capacidade Máxima" {...register("capacidadeMaxima", { valueAsNumber: true })} style={styles.input} />
        <input type="time" {...register("horaInicio")} style={styles.input} />
        <input type="time" {...register("horaFim")} style={styles.input} />

        <label style={styles.checkboxLabel}>
          <input type="checkbox" {...register("visivel")} />
          Visível
        </label>

        <label style={styles.checkboxLabel}>
          <input type="checkbox" {...register("ativo")} />
          Ativo
        </label>

        <input type="file" multiple {...register("arquivos")} style={styles.input} />

        {/* Imagens já salvas no servidor com botão para remover */}
        {imagensExistentes.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <h4>Imagens existentes:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              {imagensExistentes.map((url, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={url}
                    alt={`Imagem existente ${index + 1}`}
                    style={{ width: "150px", height: "auto", borderRadius: "8px", objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => removerImagem(index)}
                    style={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      background: "rgba(0,0,0,0.6)",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      fontWeight: "bold",
                      lineHeight: 1,
                    }}
                    aria-label="Remover imagem"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Preview das novas imagens selecionadas */}
        {renderArquivosSelecionados()}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Salvando..." : "Atualizar"}
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "1rem",
    fontFamily: "Arial",
  },
  title: {
    fontSize: "1.5rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  input: {
    padding: "0.5rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "0.6rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
  },
  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};
