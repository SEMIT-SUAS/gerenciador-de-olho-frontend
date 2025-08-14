import { useEffect, useState } from "react";
import { getAllPersona, changePersonaAtivo, changePersonaVisibility } from "../../services/servicoPersona";
import type { Persona } from "../../types/Persona";
import { AddPersonaModal } from "./components/AddPersonaModal";
import { EditPersonaModal } from "./components/EditPersonaModal";
import { toast } from "react-toastify";

export function ListaPersonas() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [erro, setErro] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPersona, setEditPersona] = useState<Persona | null>(null);

  useEffect(() => {
    fetchPersonas();
  }, []);

  async function fetchPersonas() {
    try {
      const data = await getAllPersona();
      setPersonas(data);
    } catch (e) {
      setErro((e as Error).message);
    }
  }

  async function handleToggleVisivel(persona: Persona) {
    try {
      await changePersonaVisibility(persona.id, !persona.visivel);
      toast.success(`Visibilidade de "${persona.nome}" alterada!`);
      fetchPersonas();
    } catch {
      toast.error("Erro ao alterar visibilidade");
    }
  }

  async function handleToggleAtivo(persona: Persona) {
    try {
      await changePersonaAtivo(persona.id, !persona.ativo);
      toast.success(`Status de atividade de "${persona.nome}" alterado!`);
      fetchPersonas();
    } catch {
      toast.error("Erro ao alterar status de atividade");
    }
  }

  return (
    <div>
      <h1>Lista de Personas</h1>
      {erro && <p style={{ color: "red" }}>{erro}</p>}
      <button onClick={() => setShowAddForm(true)}>Adicionar Persona</button>

      <table>
        <thead>
          <tr>
            <th>Ícone</th>
            <th>Nome</th>
            <th>Visível</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {personas.map((persona) => (
            <tr key={persona.id}>
              <td>
                <img src={persona.icone} alt={persona.nome} width={40} />
              </td>
              <td>{persona.nome}</td>
              <td>
                    <button
                        onClick={() => handleToggleVisivel(persona)}
                        style={{
                        backgroundColor: persona.visivel ? "green" : "gray",
                        color: "white",
                        border: "none",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        }}
                    >
                        {persona.visivel ? "Visível" : "Oculto"}
                    </button>
              </td>

              <td>
                    <button
                        onClick={() => handleToggleAtivo(persona)}
                        style={{
                        backgroundColor: persona.ativo ? "blue" : "gray",
                        color: "white",
                        border: "none",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        }}
                    >
                        {persona.ativo ? "Ativo" : "Inativo"}
                    </button>
              </td>

              <td>
                <button
                  onClick={() => {
                    setEditPersona(persona);
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddForm && (
        <AddPersonaModal
          onClose={() => setShowAddForm(false)}
          onSubmit={() => {
            fetchPersonas();
            setShowAddForm(false);
          }}
        />
      )}

      {showEditModal && editPersona && (
        <EditPersonaModal
          persona={editPersona}
          onClose={() => setShowEditModal(false)}
          onSubmit={() => {
            fetchPersonas();
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}