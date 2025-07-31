import React from "react";
import type { Portais } from "../../types/Portais";

interface PortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPortal: Portais;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export function PortalModal({
  isOpen,
  onClose,
  newPortal,
  handleInputChange,
  handleSubmit,
}: PortalModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "8px",
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <h3>Adicionar Portal</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={newPortal.nome}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Destaque:
            <input
              type="checkbox"
              name="destaque"
              checked={newPortal.destaque}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Link:
            <input
              type="url"
              name="link"
              value={newPortal.link}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Visível:
            <input
              type="checkbox"
              name="is_visible"
              checked={newPortal.visivel}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Ativo:
            <input
              type="checkbox"
              name="ativo"
              checked={newPortal.ativo}
              onChange={handleInputChange}
            />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "1rem",
            }}
          >
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
