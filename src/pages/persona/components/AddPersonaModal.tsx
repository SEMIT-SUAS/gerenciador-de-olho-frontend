// src/components/persona/AddPersonaModal.tsx
import { useForm } from "react-hook-form";
import { type PersonaFormData } from "../../../schemas/personaSchema";
import { uploadPersona } from "../../../services/servicoPersona";
import { toast } from "react-toastify";

interface AddPersonaModalProps {
  onClose: () => void;
  onSubmit: () => void; // callback para atualizar lista
}

export function AddPersonaModal({ onClose, onSubmit }: AddPersonaModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<PersonaFormData>({
    defaultValues: {
      nome: "",
      icone: "",
      visivel: true,
      ativo: true,
    },
  });

  async function onFormSubmit(data: PersonaFormData) {
    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("visivel", String(data.visivel));
    formData.append("ativo", String(data.ativo));

    if (data.icone instanceof File) {
      formData.append("icone", data.icone);
    }

    try {
      await uploadPersona(formData);
      toast.success("Persona adicionada com sucesso!");
      reset();
      onSubmit();
    } catch (err) {
      toast.error("Erro ao adicionar persona");
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Adicionar Persona</h2>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div>
            <label>Nome</label>
            <input
              type="text"
              {...register("nome", { required: "Nome é obrigatório" })}
            />
            {errors.nome && <span style={{ color: "red" }}>{errors.nome.message}</span>}
          </div>

          <div>
            <label>Ícone</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setValue("icone", e.target.files?.[0] || "")}
            />
          </div>

          <div>
            <label>
              <input type="checkbox" {...register("visivel")} />
              Visível
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" {...register("ativo")} />
              Ativo
            </label>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
            <button type="button" onClick={onClose} style={{ marginLeft: "0.5rem" }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
