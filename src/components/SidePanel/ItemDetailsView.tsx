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
}


function isAcao(item: Denuncia | Acao): item is Acao {
    return 'secretaria' in item;
}


export const ItemDetailsView: FC<ItemDetailsViewProps> = ({ item, denuncias, onBack }) => {
    return (
        <div className="p-4 flex flex-col h-full">
            <BackButton onClick={void} />
            
            {isAcao(item) ? (
                <AcaoDetails item={item} denuncias={denuncias} isAcao={isAcao}/>
            ) : (
                <DenunciaDetails item={item}/>
            )}
        </div>
    );
}