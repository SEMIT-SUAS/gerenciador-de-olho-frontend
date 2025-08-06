import { useState } from "react";
import { toast } from "react-toastify";
import { servicoSchema } from "../../../schemas/ServicoExterno";
import { uploadServicoExterno } from "../../../services/servicoExternoService";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export function FormServicoExterno({ onClose, onSuccess }: Props) {
  const [nome, setNome] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [visivel, setVisivel] = useState(true);
  const [ativo, setAtivo] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const servicoData = { nome, visivel, ativo, imagem: imagem ?? undefined };
    const parsed = servicoSchema.safeParse(servicoData);

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message;
      toast.error(firstError || "Dados inválidos.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("nome", nome);
    if (imagem) formData.append("imagem", imagem);
    formData.append("visivel", String(visivel));
    formData.append("ativo", String(ativo));

    try {
      await uploadServicoExterno(formData);
      toast.success("Serviço cadastrado com sucesso!");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Erro ao cadastrar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyle}>
      <div style={modalContentStyle}>
        <h3>Cadastrar Novo Serviço</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nome:</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>

          <div>
            <label>Imagem:</label>
            <input type="file" accept="image/*" onChange={(e) => setImagem(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label>
              <input type="checkbox" checked={visivel} onChange={(e) => setVisivel(e.target.checked)} />
              Visível
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} />
              Ativo
            </label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

const modalStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalContentStyle: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 8,
  width: 400,
};
