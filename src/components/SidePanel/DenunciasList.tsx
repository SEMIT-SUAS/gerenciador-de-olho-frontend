import type { ZoomToProps } from "../../pages/OcorrenciasPage";
import type { Denuncia } from "../../types/Denuncia";
import { CategoryTag, Tag } from "./Tag";
import { getCategoryBorderClass } from "./Tag";

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
                    className={` bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50 border-l-6 ${getCategoryBorderClass(denuncia.categoria.name)}`}
                    onClick={() =>
                        onItemClick(denuncia, {
                            lat: denuncia.endereco.latitude,
                            lng: denuncia.endereco.longitude
                        })
                    }
                    >
                    <div className="p-3">
                        <CategoryTag categoria={denuncia.categoria.name}/>
                        <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-md text-gray-700">{denuncia.tipo}</h3>
                        <Tag status={denuncia.status} />
                        </div>
                    <p className="text-sm text-gray-500 mt-1">{denuncia.descricao}</p>
                    </div>

                </div>
            )
        })
    )
}
