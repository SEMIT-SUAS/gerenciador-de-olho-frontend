import { Popup } from 'react-leaflet';
import type { Acao } from '../../types/Acao';

export function PinDetailsAcao({ acao }: { acao: Acao }) {
  return (
    <Popup>
      <b>Ação:</b> {acao.nome}
      <br />
      <b>Secretaria:</b> {acao.secretaria.name}
    </Popup>
  );
}
