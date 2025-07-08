import type { StatusModel } from "../../types/StatusModel"
import type { Categoria } from "../../types/CategoriaDenuncia"

type TagProps = {
    status: StatusModel | 'undefined'
}

type CategoryTagProps = {
    categoria: Categoria | undefined
}

export function Tag({ status = "undefined" }: TagProps) {
    const styles = {
        'aberto': 'bg-blue-100 text-blue-800',
        'em_andamento': 'bg-yellow-100 text-yellow-800',
        'indeferido': 'bg-red-100 text-red-800',
        'concluido': 'bg-green-100 text-green-800'
    }

    return (
        <span className={`w-fit text-xs font-medium px-2 py-1 rounded-md capitalize ${styles[status]} whitespace-nowrap`}>
            {status.replace("_", " ")}
        </span>
    )
}

export function CategoryTag ({categoria}: CategoryTagProps) {
    const stylesCategory = {
        'Infraestrutura': 'text-yellow-500',
        'Saúde Pública': 'text-green-500',
        'Trânsito e Transporte': 'text-lime-500',
        'Acessibilidade':  'text-blue-500',
        'Meio Ambiente': 'text-emerald-500'
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

export function getCategoryBorderClass(categoria: Categoria | undefined): string {
    const stylesCategoryColorMap = {
    'Infraestrutura': 'border-yellow-500',
    'Saúde Pública': 'border-green-500', 
    'Trânsito e Transporte': 'border-lime-500', 
    'Acessibilidade': 'border-blue-500',
    'Meio Ambiente': 'border-emerald-500'
    };

    let categoryNameToUse: Categoria['name'];

    if (categoria) {
        categoryNameToUse = categoria.name;
    } else {

        categoryNameToUse = 'Infraestrutura';
    }


    return stylesCategoryColorMap[categoryNameToUse];
}
