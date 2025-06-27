import type { Acao } from "../../types/Acao";

type AcoesListProps = {
    acoes: Acao[],
    onItemClick: (item: Acao) => void
}

export function AcoesList({ acoes, onItemClick }: AcoesListProps) {
    const isEmpty = acoes.length < 1

    if (isEmpty) {
        return <p className="text-center text-gray-500 mt-4">Nenhuma ação encontrada.</p>
    }

    return (
        acoes.map(acao => (
            <div
                key={acao.id}
                className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-50"
                onClick={() => onItemClick(acao)}
            >
                <h3 className="font-semibold text-gray-700">{acao.nome}</h3>
                <p className="text-sm text-gray-500">Responsável: {acao.secretaria}</p>
            </div>
        ))
    )
}