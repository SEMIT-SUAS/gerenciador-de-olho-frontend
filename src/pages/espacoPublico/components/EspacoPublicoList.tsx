import type { EspacoPublicoById } from "../../../types/EspacoPublico";
import { styles } from "./styles";

type EspacoPublicoItemProps = {
  espaco: EspacoPublicoById;
  onToggleVisivel: (id: number, visivelAtual: boolean) => void;
  onToggleAtivo: (id: number, ativoAtual: boolean) => void;
  onEdit: (id: number) => void;
};

export function EspacoPublicoItem({ espaco, onToggleVisivel, onToggleAtivo, onEdit }: EspacoPublicoItemProps) {
  return (
    <li style={styles.card}>
      <h3>{espaco.nome}</h3>
      <p>
        <strong>Endereço:</strong> {espaco.rua}, {espaco.bairro}, {espaco.cidade} - {espaco.estado}
      </p>
      <p><strong>Capacidade:</strong> {espaco.capacidadeMaxima}</p>
      <p><strong>Horário:</strong> {espaco.horaInicio} às {espaco.horaFim}</p>
      <p><strong>Latitude:</strong> {espaco.latitude} | <strong>Longitude:</strong> {espaco.longitude}</p>
      <p>
        <strong>Visível:</strong> {espaco.visivel ? "Sim" : "Não"} | <strong>Ativo:</strong> {espaco.ativo ? "Sim" : "Não"}
      </p>

      <button
        onClick={() => onToggleVisivel(espaco.id!, espaco.visivel)}
        style={{
          ...styles.toggleButton,
          backgroundColor: espaco.visivel ? "#f39c12" : "#27ae60",
        }}
      >
        {espaco.visivel ? "Ocultar" : "Exibir"}
      </button>

      <button
        onClick={() => onToggleAtivo(espaco.id!, espaco.ativo)}
        style={{
          ...styles.toggleButton,
          backgroundColor: espaco.ativo ? "#c0392b" : "#2ecc71",
        }}
      >
        {espaco.ativo ? "Desativar" : "Ativar"}
      </button>

      <button
        style={styles.editButton}
        onClick={() => onEdit(espaco.id!)}
      >
        Editar
      </button>
    </li>
  );
}
