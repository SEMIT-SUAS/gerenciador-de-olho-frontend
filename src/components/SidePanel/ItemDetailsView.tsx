import type { FC } from 'react';
import type { Denuncia } from '../../types/Denuncia';
import type { Acao } from '../../types/Acao';

import { DenunciaDetails } from './DenunciaDetails';
import { AcaoDetails } from './AcaoDetails';
import { BackButton } from '../Buttons/Backbutton';


interface ItemDetailsViewProps {
    item: Denuncia | Acao;
    denuncias: Denuncia[];
    onBack: () => void;
    onDenunciaClick: (denuncia: Denuncia) => void;
}


function isAcao(item: Denuncia | Acao): item is Acao {
    return 'secretaria' in item;
} 


export const ItemDetailsView: FC<ItemDetailsViewProps> = ({ item, denuncias, onBack, onDenunciaClick }) => {
    return (
        <div className="p-4 flex flex-col h-full">
            <BackButton 
                onClick={onBack} 
                className="mt-8 text-lg">
                Retornar à pagina anterior 
                </BackButton>
            
            {isAcao(item) ? (
                <AcaoDetails item={item} denuncias={denuncias} onDenunciaClick={onDenunciaClick}/>
            ) : (
                <DenunciaDetails item={item}/>
            )}
        </div>
    );
}