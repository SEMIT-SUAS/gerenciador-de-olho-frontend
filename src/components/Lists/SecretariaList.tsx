import type { Secretaria } from '../../types/Secretaria';

interface SecretariaListProps {
  secretarias: Secretaria[];
}

export function SecretariaList({ secretarias }: SecretariaListProps) {
  return (
    <ul>
      {secretarias.map((sec) => (
        <div
          key={sec.id}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 sm:px-6 py-4"
        >
          <div className="text-left">
            <strong>{sec.nome}</strong>
          </div>
          <div className="text-left">{sec.sigla}</div>
          <div className="text-left">
            {sec.ativo ? 'Ativa' : 'Inativa'} |{' '}
            {sec.visivel ? 'Visível' : 'Oculta'}
          </div>
        </div>
      ))}
    </ul>
  );
}
