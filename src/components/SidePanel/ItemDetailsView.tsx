import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

import { DenunciaDetails } from './Denuncia/DenunciaDetails';
import { AcaoDetails } from './Acao/AcaoDetails';
import { BackButton } from '../Buttons/Backbutton';
import { useOcorrenciasContext } from '../../context/OcorrenciasContext';

function isAcao(item: Denuncia | Acao): item is Acao {
  return 'secretaria' in item;
}

export const ItemDetailsView = () => {
  const { setPrevAction, prevAction } = useOcorrenciasContext();
  const { actualDetailItem, setActualDetailItem } = useOcorrenciasContext();

  function handleOnBackClick() {
    if (prevAction) {
      setActualDetailItem(prevAction);
      setPrevAction(null);
    } else {
      setActualDetailItem(null);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <BackButton onClick={handleOnBackClick} className="text-lg">
        Retornar à pagina anterior
      </BackButton>

      {isAcao(actualDetailItem!) ? (
        <AcaoDetails item={actualDetailItem} />
      ) : (
        <DenunciaDetails item={actualDetailItem!} />
      )}
    </div>
  );
};
