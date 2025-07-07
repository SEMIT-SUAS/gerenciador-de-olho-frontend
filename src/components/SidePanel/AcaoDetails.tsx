import { useState, type FC } from 'react';
import type { Acao } from '../../types/Acao';
import type { Denuncia } from '../../types/Denuncia';
import { Tag } from './Tag';
import { FaTrashAlt } from 'react-icons/fa';
import { ConfirmModal } from '../Modals/ConfirmModal';
import { useOcorrenciasContext } from '../../context/ocorrenciasContext';
import { toast } from 'react-toastify';
import { getPolygonoCenter } from '../../utils/geometry';

interface AcaoDetailsProps {
    item: Acao;
    denuncias: Denuncia[];
    onDenunciaClick: (denuncia: Denuncia) => void;
}


export const AcaoDetails: FC<AcaoDetailsProps> = ({ item, denuncias, onDenunciaClick }) => {
    const { setDenuncias, setAcoes, setActualDetailItem } = useOcorrenciasContext()
    const [currentDenuncia, setCurrentDenuncia] = useState<Denuncia | null>(null)
    const [isOpenRemoveDenunciaConfirmationModal, setIsOpenRemoveDenunciaConfirmationModal] = useState(false)
    const [isOpenIndeferirAcaoConfirmationModal, setIsOpenIndeferirAcaoConfirmationModal] = useState(false)
    const denunciasVinculadas = denuncias.filter(d => d.acaoId === item.id);

    async function handleRemoveDenuncia() {
        try {
            setAcoes(acoes => {
                const current = acoes.find(acao => acao.id == item.id)

                const newPolygonCoords = current!.polygonCoords.filter(
                    coord => !(coord[0] === currentDenuncia?.endereco.latitude && coord[1] === currentDenuncia?.endereco.longitude)
                );

                const newActionCoordinates = getPolygonoCenter(newPolygonCoords)

                return acoes.map(a => {
                    if (a.id == item.id) {
                        return {
                            ...a,
                            lat: newActionCoordinates[0],
                            lon: newActionCoordinates[1],
                            polygonCoords: newPolygonCoords
                        }
                    }

                    return a
                })
            })
          
            setDenuncias(current => current.map(d => {
                if (d.id == currentDenuncia?.id) {
                    return {
                        ...d,
                        status: 'aberto',
                        acaoId: null
                    }
                }

                return d
            }))

            setIsOpenRemoveDenunciaConfirmationModal(false)
            toast("Denuncia removida com sucesso dessa ação!", {
                type: "success"
            })

            setCurrentDenuncia(null)
        } catch { }
    }

    async function handleIndeferirDenuncia() {
        try {
            setActualDetailItem(current => (
                {
                    ...current!,
                    status: "indeferido"
                }
            ))

            setDenuncias(current => current.map(d => {
                if (d.acaoId == item.id) {
                    return {
                        ...d,
                        acaoId: null,
                        status: 'aberto'
                    }
                }

                return d
            }))

            setAcoes(current => current.map(a => {
                if (a.id == item.id) {
                    return {
                        ...a,
                        status: 'indeferido',
                        polygonCoords: []
                    }
                }

                return a
            }))

            setIsOpenIndeferirAcaoConfirmationModal(false)
            toast("Ação indeferida com sucesso!", {
                type: "success"
            })
        } catch { }
    }

    return (
        <>
            <div className="flex flex-col gap-3 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800">{item.nome}</h2>
                        <p className="text-sm text-gray-500">Responsável: {item.secretaria}</p>
                    </div>
                    <Tag status={item.status} />
                </div>

                {item.polygonCoords.length > 0 && item.status != 'indeferido' && (
                    <div className="flex items-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800">Esta ação possui uma área de cobertura (polígono) no mapa.</p>
                    </div>
                )}

                {item.status != 'indeferido' && <div>
                    <h3 className="font-semibold text-sm text-gray-800 mb-1">Denúncias Vinculadas ({denunciasVinculadas.length}):</h3>
                    <div className="rounded-lg max-h-80 space-y-3 p-2">
                        {denunciasVinculadas.length > 0 ? denunciasVinculadas.map(d => (
                            <div
                                key={d.id}
                                onClick={() => onDenunciaClick(d)}
                                aria-label={`Ver detalhes da denúncia ${d.tipo}`}
                                className="group flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-left shadow-sm transition-all hover:border-blue-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <div className='flex flex-col'>
                                    <p className="font-semibold text-gray-800">{d.tipo.name}</p>
                                    <p className="text-sm text-gray-500">{d.endereco.rua}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Tag status={d.status} />
                                    {item.status != 'concluido' && denunciasVinculadas.length > 1 && <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentDenuncia(d)
                                            setIsOpenRemoveDenunciaConfirmationModal(true)
                                        }}
                                        aria-label={`Desvincular denúncia ${d.tipo}`}
                                        className='z-10 cursor-pointer rounded-full p-2 text-gray-400 transition-colors hover:bg-red-100 hover:text-red-600'
                                    >
                                        <FaTrashAlt />
                                    </button>}
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <p className="text-sm text-gray-500">Nenhuma denúncia vinculada.</p>
                            </div>
                        )}
                    </div>
                </div>}

                {item.status == 'aberto' || item.status == 'em_andamento' && (
                    <button
                        onClick={() => {
                            setIsOpenIndeferirAcaoConfirmationModal(true)
                        }}
                        className='w-full cursor-pointer font-bold py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                        Indeferir ação
                    </button>
                )}
            </div>

            <ConfirmModal
                isOpen={isOpenRemoveDenunciaConfirmationModal}
                title='Disvincular denúncia'
                message='Você realmente deseja disvincular essa denúncia dessa ação?'
                onConfirm={handleRemoveDenuncia}
                onCancel={() => {
                    setCurrentDenuncia(null)
                    setIsOpenRemoveDenunciaConfirmationModal(false)
                }}
            />

            <ConfirmModal
                isOpen={isOpenIndeferirAcaoConfirmationModal}
                title='Indeferir denúncia'
                message='Você realmente vai indeferir essa ação, depois disso não tem mais volta. Tenha bastante cuidado!'
                onCancel={() => setIsOpenIndeferirAcaoConfirmationModal(false)}
                onConfirm={handleIndeferirDenuncia}
            />
        </>
    );
}