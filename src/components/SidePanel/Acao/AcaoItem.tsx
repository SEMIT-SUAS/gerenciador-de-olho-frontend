import { useNavigate } from 'react-router-dom';
import type { AcaoBasicInfoModel } from '../../../types/Acao';
import { Tag } from '../Tag';

type AcaoItemProps = {
  acao: AcaoBasicInfoModel;
};

export function AcaoItem({ acao }: AcaoItemProps) {
  const navigate = useNavigate();

  return (
    <div
      key={acao.id}
      className="flex flex-col gap-1 p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
      onClick={() => navigate(`/ocorrencias/acoes/${acao.id}`)}
    >
      <h3 className="font-semibold text-gray-700">{acao.nome}</h3>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-500">
          Responsável: {acao.siglaSecretaria}
        </p>

        <Tag status={acao.status} />
      </div>
    </div>
  );
}
