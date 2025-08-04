import type { Secretaria } from "../../../types/Secretaria";

interface SecretariaListProps {
  secretarias: Secretaria[];
}

export function SecretariaList({ secretarias }: SecretariaListProps) {
  return (
    <ul>
      {secretarias.map((sec) => (
        <li key={sec.id}>
          <strong>{sec.nome}</strong> ({sec.sigla}) - {sec.ativo ? "Ativa" : "Inativa"} | {sec.visivel ? "Visível" : "Oculta"}
        </li>
      ))}
    </ul>
  );
}
