import { useAddAcao } from "../../../context/AddAcaoContext";

import { useOcorrenciasContext } from "../../../context/OcorrenciasContext"
import { useState, type FC } from "react";
import { ConfirmModal } from "../../Modals/ConfirmModal";
import { BackButton } from "../../Buttons/Backbutton";
import { FaBatteryEmpty } from "react-icons/fa";
import { DenunciaItem } from "./DenunciaItem";
import { FaMapPin } from "react-icons/fa";
import type { Denuncia } from "../../../types/Denuncia";
import { useVincularItemContext } from "../../../context/VincularItemContext";

export const VincularDenunciaView: FC = () => {
    const {setDenuncias, setActualDetailItem} = useOcorrenciasContext();
    const [isOpen, setIsOpen] = useState(false);
    const {confirmLink, cancelLinking, acaoParaVincular, setIsAddingDenunciaAcao, isAddingDenunciaAcao} = useVincularItemContext();
    const {denunciasVinculadas, setDenunciasVinculadas} = useAddAcao();

    function handleOnConfirmLink(denunciasVinculadas: Denuncia[]) {
        confirmLink(acaoParaVincular!.id);
        setActualDetailItem(acaoParaVincular);
        setDenuncias([]);
    }

    function handleOnSelectDenuncias(denunciaParaVincular: Denuncia[]) {
        setIsOpen(true);
        setDenuncias(denunciaParaVincular);
    }
    

    return (
        <>
        <div className="flex flex-col h-full">
            <BackButton onClick={cancelLinking} />
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">Ação selecionada:</p>
            <p className="font-bold text-blue-900">
                {acaoParaVincular!.nome}
            </p>
            <p className="flex text-xs text-blue-800 mt-1">
                <span className="mr-1">
                <FaMapPin />
                </span>
                {`${acaoParaVincular!.secretaria}`}
            </p>
            </div>
            <button
            onClick={() => setIsAddingDenunciaAcao((current) => !current)}
            className={`w-full ${
                isAddingDenunciaAcao
                ? ' border-2 border-red-600 bg-red-600 hover:bg-red-700 text-white'
                : ' border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            } text-sm font-semibold py-2 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed mb-2`}
            >
            {!isAddingDenunciaAcao
                ? 'Selecionar Denúncias no Mapa'
                : 'Cancelar seleção no mapa'}
            </button>

            <h3 className="font-semibold text-gray-800 mb-2">
            </h3>
            <div className="flex flex-col gap-4 max-h-[19rem] overflow-y-auto">
                {denunciasVinculadas.length === 0 ? (
                <span className="flex items-center gap-2 text-gray-500">
                    <FaBatteryEmpty />
                    Nenhum item selecionado
                </span>
                ) : (
                denunciasVinculadas.map((d) => (
                    <DenunciaItem
                    key={d.id}
                    denuncia={d}
                    onClick={() => {}}
                    showDescription={false}
                    showTag={false}
                    isDeletable={true}
                    onTrashClick={() => {
                        setDenunciasVinculadas((denuncias) =>
                        denuncias.filter((dActual) => dActual.id !== d.id),
                        );
                    }}
                    />
                ))
                )}
            </div>
            {denunciasVinculadas && (
            <button
                className="w-full bg-bg-blue-600 bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                onClick={() => handleOnSelectDenuncias(denunciasVinculadas!)}
            >
                Confirmar vínculo
            </button>
            )}
        </div>

        <ConfirmModal
            isOpen={isOpen}
            title="Vínculo de denúncia à ação"
            message={`Você deseja vincular as denúncias à essa ação ${acaoParaVincular?.nome}?`}
            onCancel={cancelLinking}
            onConfirm={() => handleOnConfirmLink(denunciasVinculadas!)}
        />
        </>
    );
}