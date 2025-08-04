import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Secretaria } from "../../types/Secretaria";
import { getAllSecretarias } from "../../services/secretariaService";
import { SecretariaList } from "./components/SecretariaList";
import { SecretariaFormModal } from "./components/SecretariaFormModal";

export function SecretariaPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
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

  const handleSucessoCadastro = () => {
    setModalAberto(false);
    carregarSecretarias();
  };

  return (
    <div>
      <h1>Secretarias</h1>

      <button onClick={() => setModalAberto(true)}>+ Nova Secretaria</button>

      <SecretariaList secretarias={secretarias} />

      {modalAberto && (
        <SecretariaFormModal
          onClose={() => setModalAberto(false)}
          onSuccess={handleSucessoCadastro}
        />
      )}
    </div>
  );
}
