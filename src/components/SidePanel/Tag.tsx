import type { StatusModel } from "../../types/StatusModel"

type TagProps = {
    status: StatusModel | 'undefined'
}

export function Tag({ status = "undefined" }: TagProps) {
    const styles = {
        'aberto': 'bg-blue-100 text-blue-800',
        'em_andamento': 'bg-yellow-100 text-yellow-800',
        'indeferido': 'bg-red-100 text-red-800',
        'concluido': 'bg-green-100 text-green-800'
    }

    return (
        <span className={`w-fit text-xs font-medium px-2 py-1 rounded-md capitalize ${styles[status]}`}>
            {status.replace("_", " ")}
        </span>
    )
}