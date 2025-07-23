import { Popup } from 'react-leaflet';
import type { AcaoModel } from '../../types/Acao';

export function PinDetailsAcao({ acao }: { acao: AcaoModel }) {
  return (
    <Popup>
      <b>Ação:</b> {acao.nome}
      <br />
      <b>Secretaria:</b> {acao.secretaria.nome}
    </Popup>
  );
}
