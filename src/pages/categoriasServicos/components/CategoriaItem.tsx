import type { ServicoCategoria } from "../../../types/CategoriaServico";

interface Props {
  cat: ServicoCategoria & { id: number };
  onToggleAtivo: (cat: ServicoCategoria & { id: number }) => void;
  onToggleVisivel: (cat: ServicoCategoria & { id: number }) => void;
  onEdit: () => void;
}

export function CategoriaItem({ cat, onToggleAtivo, onToggleVisivel, onEdit }: Props) {
  const src = typeof cat.icone === "string"
    ? cat.icone
    : cat.icone instanceof File
      ? URL.createObjectURL(cat.icone)
      : "";

  return (
    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
      <img src={src} alt={cat.nome} width="40" style={{ marginRight: '10px' }} />
      <span style={{ flexGrow: 1 }}>{cat.nome}</span>
      <button onClick={() => onToggleAtivo(cat)} style={{ marginRight: '5px' }}>
        {cat.ativo ? 'Desativar' : 'Ativar'}
      </button>
      <button onClick={() => onToggleVisivel(cat)} style={{ marginRight: '5px' }}>
        {cat.visivel ? 'Ocultar' : 'Mostrar'}
      </button>
      <button onClick={onEdit}>Editar</button>
    </li>
  );
}