import type { Denuncia } from "../../types/Denuncia";
import { Tag } from "./Tag";

type DenunciasListProps = {
    denuncias: Denuncia[],
    onItemClick: (item: Denuncia) => void
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
                    className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                    onClick={() => onItemClick(denuncia)}
                >
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">{denuncia.titulo}</h3>
                        <Tag status={denuncia.status} />
                    </div>

                    <p className="text-sm text-gray-500 mt-1">{denuncia.descricao}</p>
                </div>
            )
        })
    )
}
