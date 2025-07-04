import type { FC } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

import { DenunciaDetails } from './DenunciaDetails';
import { AcaoDetails } from './AcaoDetails';
import { BackButton } from '../Buttons/Backbutton';
import type { ZoomToProps } from '../../pages/OcorrenciasPage';


interface ItemDetailsViewProps {
    item: Denuncia | Acao;
    denuncias: Denuncia[];
    onBack: () => void;
    onDenunciaClick: (denuncia: Denuncia, zoomToData: ZoomToProps) => void;
}


function isAcao(item: Denuncia | Acao): item is Acao {
    return 'secretaria' in item;
} 


export const ItemDetailsView: FC<ItemDetailsViewProps> = ({ item, denuncias, onBack, onDenunciaClick }) => {
    return (
        <div className="px-4 flex flex-col h-full">
            <BackButton 
                onClick={onBack} 
                className="text-lg">
                Retornar à pagina anterior 
                </BackButton>
            {isAcao(item) ? (
                <AcaoDetails item={item} denuncias={denuncias} onDenunciaClick={() => onDenunciaClick(item, {
                    lat: item.lat,
                    lng: item.lon
                })}/>
            ) : (
                <DenunciaDetails item={item}/>
            )}
        </div>
    );
}