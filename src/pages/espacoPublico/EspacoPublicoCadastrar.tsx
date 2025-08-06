import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { CreateEspacoPublico } from "../../types/EspacoPublico";
import { uploadEspacoPublico } from "../../services/EspacoPublico";
import { espacoPublicoSchema } from "../../schemas/espacoPublicoSchema";

export function EspacoPublicoForm() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateEspacoPublico>({
    defaultValues: {
      nome: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      latitude: "",
      longitude: "",
      capacidade_maxima: null,
      hora_inicio: "",
      hora_fim: "",
      visivel: true,
      ativo: true,
      arquivos: undefined!,
      id: null,
    },
  });

  const onSubmit = async (data: CreateEspacoPublico) => {
    const parsed = espacoPublicoSchema.safeParse(data);

    if (!parsed.success) {
      parsed.error.errors.forEach((err) => {
        toast.error(err.message);
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (key === "arquivos" && value instanceof FileList) {
          Array.from(value).forEach((file) => {
            formData.append("arquivos", file);
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      await uploadEspacoPublico(formData);
      toast.success("Espaço público cadastrado com sucesso!");
      reset();
      navigate("/espaco-publico");
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar espaço público");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastrar Espaço Público</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input placeholder="Nome" {...register("nome", {required: "Estado obrigatório" })} style={styles.input}/>
        {errors.estado && <p style={styles.error}>{errors.estado.message}</p>}

        <input placeholder="Estado" {...register("estado", { required: "Estado obrigatório" })} style={styles.input} />
        {errors.estado && <p style={styles.error}>{errors.estado.message}</p>}

        <input placeholder="Cidade" {...register("cidade", { required: "Cidade obrigatória" })} style={styles.input} />
        {errors.cidade && <p style={styles.error}>{errors.cidade.message}</p>}

        <input placeholder="Bairro" {...register("bairro")} style={styles.input} />
        <input placeholder="Rua" {...register("rua")} style={styles.input} />

        <input type="number" step="any" placeholder="Latitude" {...register("latitude", { valueAsNumber: true })} style={styles.input} />
        <input type="number" step="any" placeholder="Longitude" {...register("longitude", { valueAsNumber: true })} style={styles.input} />

        <input type="number" placeholder="Capacidade Máxima" {...register("capacidade_maxima" )} style={styles.input} />
        <input type="time" {...register("hora_inicio")} style={styles.input} />
        <input type="time" {...register("hora_fim")} style={styles.input} />

        <label style={styles.checkboxLabel}>
          <input type="checkbox" {...register("visivel")} />
          Visível
        </label>

        <label style={styles.checkboxLabel}>
          <input type="checkbox" {...register("ativo")} />
          Ativo
        </label>

        <input type="file" multiple {...register("arquivos")} style={styles.input} />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 500,
    margin: "0 auto",
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    marginBottom: "1rem",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.95rem",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  error: {
    color: "red",
    fontSize: "0.85rem",
    marginTop: "-0.5rem",
  },
};
