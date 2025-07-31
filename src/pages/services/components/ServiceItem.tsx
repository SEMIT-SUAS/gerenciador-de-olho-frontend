import { Link } from "react-router-dom";
import type { Services } from "../../../types/Services";

type Props = {
  service: Services;
  onEdit: (id: number) => void;
  onToggleVisibility: (id: number, visivel: boolean) => void;
  onToggleActive: (id: number, ativo: boolean) => void;
};

export function ServiceItem({
  service,
  onEdit,
  onToggleVisibility,
  onToggleActive,
}: Props) {
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
      <Link
        to={`/servico/${service.id}`}
        style={{ textDecoration: "none", color: "inherit", flex: 1 }}
      >
        <h3>{service.nome}</h3>
        <p>
          <strong>Descrição:</strong> {service.descricao}
        </p>
        <p>
          <strong>Categoria:</strong> {service.categoria?.nome}
        </p>
      </Link>

      <div style={{ display: "flex", gap: "0.5rem", marginLeft: "1rem" }}>
        <button onClick={() => onEdit(service.id!)}>Editar</button>
        <button onClick={() => onToggleVisibility(service.id!, service.visivel)}>
          {service.visivel ? "Ocultar" : "Mostrar"}
        </button>
        <button onClick={() => onToggleActive(service.id!, service.ativo)}>
          {service.ativo ? "Inativar" : "Ativar"}
        </button>
      </div>
    </li>
  );
}
