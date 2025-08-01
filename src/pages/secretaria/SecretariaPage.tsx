import { useEffect, useState } from "react";
import { getAllSecretarias, uploadSecretaria } from "../../services/secretariaService";
import { toast } from "react-toastify";
import type { Secretaria } from "../../types/Secretaria";

export function SecretariaPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [form, setForm] = useState<Omit<Secretaria, "id">>({
    nome: "",
    sigla: "",
    visivel: true,
    ativo: true,
  });

  const [loading, setLoading] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    carregarSecretarias();
  }, []);

  async function carregarSecretarias() {
    try {
      const lista = await getAllSecretarias();
      setSecretarias(lista);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    const finalValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const novaSecretaria: Secretaria = {
        ...form,
        id: 0,
      };

      await uploadSecretaria(novaSecretaria);
      toast.success("Secretaria cadastrada com sucesso!");
      setForm({ nome: "", sigla: "", visivel: true, ativo: true });
      setModalAberto(false);
      carregarSecretarias();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Secretarias</h1>

      <button onClick={() => setModalAberto(true)}>
        + Nova Secretaria
      </button>

      <ul>
        {secretarias.map((sec) => (
          <li key={sec.id}>
            <strong>{sec.nome}</strong> ({sec.sigla}) -{" "}
            {sec.ativo ? "Ativa" : "Inativa"} |{" "}
            {sec.visivel ? "Visível" : "Oculta"}
          </li>
        ))}
      </ul>

      {/* Modal */}
      {modalAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Cadastrar Secretaria</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nome"
                placeholder="Nome"
                value={form.nome}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="sigla"
                placeholder="Sigla"
                value={form.sigla}
                onChange={handleChange}
                required
              />

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="visivel"
                  checked={form.visivel}
                  onChange={handleChange}
                />
                Visível
              </label>

              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="ativo"
                  checked={form.ativo}
                  onChange={handleChange}
                />
                Ativo
              </label>

              <div>
                <button type="button" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
                <button type="submit" disabled={loading}>
                  {loading ? "Salvando..." : "Cadastrar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: 400,
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 16,
  },
};
