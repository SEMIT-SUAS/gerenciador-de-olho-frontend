import type { Categoria } from '../../types/CategoriaDenuncia'
import type { StatusModel } from '../../types/StatusModel'

type TagProps = {
  status: StatusModel | 'undefined'
}

type CategoryTagProps = {
    categoria: Categoria | undefined
}

export function Tag({ status = 'undefined' }: TagProps) {
  const styles = {
    aberto: 'bg-blue-100 text-blue-800',
    em_andamento: 'bg-yellow-100 text-yellow-800',
    indeferido: 'bg-red-100 text-red-800',
    concluido: 'bg-green-100 text-green-800',
  }

    return (
        <span className={`w-fit text-xs font-medium px-2 py-1 rounded-md capitalize ${styles[status]}`}>
            {status.replace("_", " ")}
        </span>
    )
}



export function CategoryTag ({categoria}: CategoryTagProps) {
    const stylesCategory = {
        'Infraestrutura': 'text-yellow-700',
        'Saúde Pública': 'text-green-700',
        'Trânsito e Transporte': 'text-lime-700',
        'Acessibilidade':  'text-blue-700',
        'Meio Ambiente': 'text-emerald-700'
    }

    let categoryNameToUse: Categoria['name'] | undefined;

    if (categoria) { 
        categoryNameToUse = categoria.name;
    } else {
        categoryNameToUse = 'Infraestrutura';
    }

    return (
        <span className={`text-xs font-semibold ${categoryNameToUse ? stylesCategory[categoryNameToUse] : ''}`}>
            {categoryNameToUse}
        </span>
    )
}

