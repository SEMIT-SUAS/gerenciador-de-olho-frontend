import { Tooltip } from 'react-leaflet';
import type { DenunciaInMap, DenunciaModel } from '@/types/Denuncia';
import { calcularDiasAtras } from '@/utils/data';
import { getDenunciaStatus } from '@/utils/getDenunciaStatus';

export function DenunciaTooltip({ denuncia }: { denuncia: DenunciaInMap }) {
  const criadaHa = calcularDiasAtras(denuncia.criadoEm);
  // const denunciaStatus = getDenunciaStatus(denuncia);

  return (
    <Tooltip
      direction="top"
      offset={[0, -20]}
      className="bg-white border border-gray-300 rounded-md shadow-md p-3 font-sans text-sm text-gray-800 max-w-xs z-[1000]"
    >
      <div className="space-y-1">
        <h3 className="text-base font-bold text-black">
          {denuncia.nomeTipoDenuncia}
        </h3>
        {/* <p>
          <strong>Status:</strong> {denunciaStatus}
        </p> */}
        <p>
          <strong>Criada:</strong> {criadaHa}
        </p>
      </div>
    </Tooltip>
  );
}
