import type { ZoomToProps } from "../../pages/OcorrenciasPage";
import type { Denuncia } from "../../types/Denuncia";
<<<<<<< Updated upstream
import { Tag } from "./Tag";
=======
import { CategoryTag, Tag } from "./Tag";
>>>>>>> Stashed changes

type DenunciasListProps = {
    denuncias: Denuncia[],
    onItemClick: (item: Denuncia, zoomToData: ZoomToProps) => void
}

export function DenunciasList({ denuncias, onItemClick }: DenunciasListProps) {
    const isEmpty = denuncias.length < 1

    if (isEmpty) {
        return <p className="text-center text-gray-500 mt-4">Nenhuma denúncia encontrada.</p>
    }

    return (
        denuncias.map(denuncia => {
            return (
                <div
                    key={denuncia.id}
<<<<<<< Updated upstream
                    className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
=======
                    className={` bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50`}
>>>>>>> Stashed changes
                    onClick={() =>
                        onItemClick(denuncia, {
                            lat: denuncia.endereco.latitude,
                            lng: denuncia.endereco.longitude
                        })
                    }
                >
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-md text-gray-700">{denuncia.titulo}</h3>
                        <Tag status={denuncia.status} />
<<<<<<< Updated upstream
=======
                        </div>
                    <p className="text-sm text-gray-500 mt-1">{`${denuncia.endereco.rua}, ${denuncia.endereco.bairro}`}</p>
>>>>>>> Stashed changes
                    </div>

                    <p className="text-sm text-gray-500 mt-1">{denuncia.descricao}</p>
                </div>
            )
        })
    )
}
