import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { secretariaSchema } from "../../../schemas/secretariaSchema";
import { uploadSecretaria } from "../../../services/secretariaService";
import type { createSecretaria } from "../../../types/Secretaria";

interface SecretariaFormModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SecretariaFormModal({ onClose, onSuccess }: SecretariaFormModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<createSecretaria>({
    defaultValues: {
      nome: "",
      sigla: "",
      visivel: true,
      ativo: true,
    },
  });

  const onSubmit = async (data: createSecretaria) => {
    setLoading(true);
    try {
      secretariaSchema.parse(data); // valida com Zod

      await uploadSecretaria(data);

      toast.success("Secretaria cadastrada com sucesso!");
      reset();
      onSuccess();
    } catch (error: any) {
      if (error.name === "ZodError") {
        for (const err of error.errors) {
          setError(err.path[0] as keyof createSecretaria, { message: err.message });
        }
        toast.error(error.errors.map((e: any) => e.message).join("\n"));
      } else {
        toast.error(error.message || "Erro ao cadastrar.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <h2>Cadastrar Secretaria</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="text" placeholder="Nome" {...register("nome")} />
          {errors.nome && <p style={{ color: "red" }}>{errors.nome.message}</p>}

          <input type="text" placeholder="Sigla" {...register("sigla")} />
          {errors.sigla && <p style={{ color: "red" }}>{errors.sigla.message}</p>}

          <label style={styles.checkboxLabel}>
            <input type="checkbox" {...register("visivel")} />
            Visível
          </label>

          <label style={styles.checkboxLabel}>
            <input type="checkbox" {...register("ativo")} />
            Ativo
          </label>

          <div>
            <button type="button" onClick={onClose}>Cancelar</button>
            <button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "1.5rem",
    borderRadius: "8px",
    width: "320px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    marginBottom: "0.5rem",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    fontSize: "0.9rem",
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  buttonCancel: {
    padding: "8px 16px",
    backgroundColor: "#eee",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  },
  buttonSubmit: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  errorText: {
    color: "red",
    marginTop: "-0.4rem",
    marginBottom: "0.5rem",
    fontSize: "0.85rem",
  },
};