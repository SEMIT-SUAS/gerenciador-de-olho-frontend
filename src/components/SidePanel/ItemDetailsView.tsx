import type { FC } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

import { DenunciaDetails } from './Denuncia/DenunciaDetails';
import { AcaoDetails } from './Acao/AcaoDetails';
import { BackButton } from '../Buttons/Backbutton';
import type { ZoomToProps } from '../../pages/OcorrenciasPage';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';

interface ItemDetailsViewProps {
  item: Denuncia | Acao;
  onBack: (item: null | Acao) => void;
  onDenunciaClick: (denuncia: Denuncia, zoomToData: ZoomToProps) => void;
}

function isAcao(item: Denuncia | Acao): item is Acao {
  return 'secretaria' in item;
}

export const ItemDetailsView: FC<ItemDetailsViewProps> = ({
  item,
  onBack,
  onDenunciaClick,
}) => {
  const { setPrevAction, prevAction } = useOcorrenciasContext();
  function handleOnBackClick() {
    if (prevAction) {
      onBack(prevAction);
      setPrevAction(null);
    } else {
      onBack(null);
    }
  }

  return (
    <div className="px-4 flex flex-col h-full">
      <BackButton onClick={handleOnBackClick} className="text-lg">
        Retornar à pagina anterior
      </BackButton>

      {isAcao(item) ? (
        <AcaoDetails
          item={item}
          onDenunciaClick={(denuncia) =>
            onDenunciaClick(denuncia, {
              lat: item.lat,
              lng: item.lon,
            })
          }
        />
      ) : (
        <DenunciaDetails item={item} />
      )}
    </div>
  );
};
