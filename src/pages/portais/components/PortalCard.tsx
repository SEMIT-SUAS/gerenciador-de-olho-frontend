import { Link } from "react-router-dom";
import type { Portais } from "../../../types/Portais";

interface Props {
  portal: Portais;
  onToggleAtivo: (id: number, ativo: boolean) => void;
  onToggleVisivel: (id: number, visivel: boolean) => void;
}

export function PortalCard({ portal, onToggleAtivo, onToggleVisivel }: Props) {
  return (
    <li
      style={{
        border: "1px solid #ccc",
        padding: "1rem",
        marginBottom: "1rem",
        borderRadius: "4px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ flex: 1 }}>
        <Link to={`/portal/${portal.id}`} style={{ textDecoration: "none", color: "inherit" }}>
          <h3>{portal.nome}</h3>
        </Link>
        <p>
          <strong>Link:</strong>{" "}
          <a href={portal.link} target="_blank" rel="noopener noreferrer">
            {portal.link}
          </a>
        </p>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
        <button onClick={() => onToggleAtivo(portal.id!, portal.ativo)}>
          {portal.ativo ? "Inativar" : "Ativar"}
        </button>
        <button onClick={() => onToggleVisivel(portal.id!, portal.visivel)}>
          {portal.visivel ? "Ocultar" : "Mostrar"}
        </button>
      </div>
    </li>
  );
}
