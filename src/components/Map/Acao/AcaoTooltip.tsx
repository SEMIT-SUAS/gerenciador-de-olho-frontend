import { Tooltip } from 'react-leaflet';
import type { AcaoBasicInfoModel } from '../../../types/Acao';
import { calcularDiasAtras } from '@/utils/data';

export function AcaoTooltip({ acao }: { acao: AcaoBasicInfoModel }) {
  const criadaHa = calcularDiasAtras(acao.criadoEm);

  return (
    <Tooltip
      direction="top"
      offset={[0, -20]}
      className="bg-white border border-gray-300 rounded-md shadow-md p-3 font-sans text-sm text-gray-800 max-w-xs z-[1000]"
    >
      <div className="space-y-1">
        <h3 className="text-base font-bold text-black">{acao.nome}</h3>
        <p>
          <strong>Status:</strong> {acao.status}
        </p>
        <p>
          <strong>Criada:</strong> {criadaHa}
        </p>
      </div>
    </Tooltip>
  );
}
