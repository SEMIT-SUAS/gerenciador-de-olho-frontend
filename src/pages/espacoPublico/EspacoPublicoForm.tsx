import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import type { EspacoPublico } from "../../types/EspacoPublico";
import { uploadEspacoPublico } from "../../services/EspacoPublico";

export function EspacoPublicoForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EspacoPublico>({
    defaultValues: {
      nome: "",
      estado: "",
      cidade: "",
      bairro: "",
      rua: "",
      latitude: "",
      longitude: "",
      capcidade_maxima: null,
      hora_inicio: "",
      hora_fim: "",
      visivel: true,
      ativo: true,
      arquivos: undefined!,
      id: null,
    },
  });

  const onSubmit = async (data: EspacoPublico) => {
    try {
      setLoading(true);

      const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
    if (key === "arquivos" && value instanceof FileList) {
        Array.from(value).forEach((file) => {
        formData.append("arquivos", file);
        });
    } else if (value !== null && value !== undefined) {
        formData.append(key, value as any);
    }
    });


      await uploadEspacoPublico(formData);
      toast.success("Serviço cadastrado com sucesso!");
      reset();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar serviço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Cadastrar Serviço</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <input placeholder="Nome" {...register("nome", {required: "Estado obrigatório" })} style={styles.input}/>
        {errors.estado && <p style={styles.error}>{errors.estado.message}</p>}

        <input placeholder="Estado" {...register("estado", { required: "Estado obrigatório" })} style={styles.input} />
        {errors.estado && <p style={styles.error}>{errors.estado.message}</p>}

        <input placeholder="Cidade" {...register("cidade", { required: "Cidade obrigatória" })} style={styles.input} />
        {errors.cidade && <p style={styles.error}>{errors.cidade.message}</p>}

        <input placeholder="Bairro" {...register("bairro")} style={styles.input} />
        <input placeholder="Rua" {...register("rua")} style={styles.input} />

        <input placeholder="Latitude" {...register("latitude")} style={styles.input} />
        <input placeholder="Longitude" {...register("longitude")} style={styles.input} />

        <input type="number" placeholder="Capacidade Máxima" {...register("capcidade_maxima", { valueAsNumber: true })} style={styles.input} />
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
