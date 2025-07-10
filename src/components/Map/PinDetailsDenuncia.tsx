import { Popup } from 'react-leaflet';
import type { Denuncia } from '../../types/Denuncia';

export function PinDetailsDenuncia({ denuncia }: { denuncia: Denuncia }) {
  return (
    <Popup>
      <b>Denúncia:</b> {denuncia.titulo}
      <br />
      <b>Status:</b>
      <span className="capitalize">{denuncia?.status?.replace('_', ' ')}</span>
    </Popup>
  );
}
