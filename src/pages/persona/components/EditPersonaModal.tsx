import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Persona } from "../../../types/Persona";
import { updatePersona } from "../../../services/servicoPersona";
import { toast } from "react-toastify";
import { personaSchema, type PersonaFormData } from "../../../schemas/personaSchema";

interface EditPersonaModalProps {
  persona: Persona;
  onClose: () => void;
  onSubmit: () => void;
}

export function EditPersonaModal({ persona, onClose, onSubmit }: EditPersonaModalProps) {
  const { register, handleSubmit, reset, watch, setError, formState: { isSubmitting } } =
    useForm<PersonaFormData>();

  const iconeFile = watch("icone");

  useEffect(() => {
    reset({
      nome: persona.nome,
      icone: undefined as any,
      visivel: persona.visivel,
      ativo: persona.ativo,
    });
  }, [persona, reset]);

  async function handleUpdate(data: PersonaFormData) {
    // validação manual usando Zod
    const result = personaSchema.safeParse(data);
    if (!result.success) {
      result.error.errors.forEach(err => {
        if (err.path[0]) setError(err.path[0] as any, { message: err.message });
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", String(persona.id));
      formData.append("nome", data.nome);

      if (data.icone && data.icone.length > 0) {
        formData.append("icone", data.icone[0]);
      }

      formData.append("visivel", String(data.visivel));
      formData.append("ativo", String(data.ativo));

      await updatePersona(formData);
      toast.success("Persona atualizada com sucesso!");
      onSubmit();
    } catch {
      toast.error("Erro ao atualizar persona");
    }
  }

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Persona</h2>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div>
            <label>Nome: </label>
            <input {...register("nome")} />
          </div>

          <div>
            <label>Ícone (Imagem)</label>
            <div style={{ marginBottom: "0.5rem" }}>
              <img
                src={
                  iconeFile && iconeFile.length > 0
                    ? URL.createObjectURL(iconeFile[0])
                    : persona.icone
                }
                alt="Ícone da persona"
                width={80}
                style={{ display: "block", marginBottom: "0.5rem" }}
              />
            </div>
            <input type="file" accept="image/*" {...register("icone")} />
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
