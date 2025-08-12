import deleteIcon from '../../assets/delete.svg';
import updateIcon from '../../assets/update.svg';
import viewIcon from '../../assets/view.svg';

export type Secretaria = {
  id: string | number;
  nome: string;
  sigla: string;
  ativo: boolean;
  visivel: boolean;
};

interface SecretariaListProps {
  secretarias: Secretaria[];
  onEdit: (id: number | string) => void;
  onView: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}

export function SecretariaList({ secretarias, onEdit, onView, onDelete }: SecretariaListProps) {
  return (
    <ul>
      {secretarias.map((sec) => (
        <li
          key={sec.id}
          className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 md:px-6 py-4 border-b border-gray-100"
        >
          <div className="md:col-span-3 text-left">
            <strong className="block">{sec.nome}</strong>
          </div>
          <div className="md:col-span-3 text-left">{sec.sigla}</div>
          <div className="md:col-span-3 text-left">
            {sec.ativo ? 'Ativa' : 'Inativa'} {'|'}{' '}
            {sec.visivel ? 'Visível' : 'Oculta'}
          </div>
          <div className="md:col-span-3 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <button
                aria-label={`Editar ${sec.nome}`}
                className="text-blue-600 hover:text-blue-800"
                onClick={() => onEdit(sec.id)}
              >
                <img src={updateIcon} alt="Editar" className="w-5 h-5" />
              </button>
              <button
                aria-label={`Visualizar ${sec.nome}`}
                className="text-green-600 hover:text-green-800"
                onClick={() => onView(sec.id)}
              >
                <img src={viewIcon} alt="Visualizar" className="w-5 h-5" />
              </button>
              <button
                aria-label={`Deletar ${sec.nome}`}
                className="text-red-600 hover:text-red-800"
                onClick={() => onDelete(sec.id)}
              >
                <img src={deleteIcon} alt="Deletar" className="w-5 h-5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
