import { Popup } from 'react-leaflet';
import type { DenunciaModel } from '../../types/Denuncia';

export function PinDetailsDenuncia({ denuncia }: { denuncia: DenunciaModel }) {
  return (
    <Popup>
      <span>{denuncia.tipo.nome}</span>
    </Popup>
  );
}
