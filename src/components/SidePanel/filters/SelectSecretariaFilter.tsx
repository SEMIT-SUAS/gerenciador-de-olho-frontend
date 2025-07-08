import { useEffect, useState, type ChangeEvent } from "react"
import { toast } from "react-toastify"
import { ArrowDown } from "../../ArrowDown"
import type { Secretaria, Secretarias } from "../../../types/Secretaria"

type SelectSecretariaFilterProps = {
    onSecretariaChange: (secretaria: Secretarias) => void
}

export function SelectSecretariaFilter({ onSecretariaChange }: SelectSecretariaFilterProps) {
    const [secretarias, setSecretarias] = useState<Secretaria[] | null>(null)

    async function fetchSecretarias(): Promise<Secretaria[] | null> {
        try {
            return [
                { id: 1, name: 'SEMMAM' },
                { id: 2, name: 'SEMOSP' },
                { id: 3, name: 'SEMURH' },
            ];
        } catch {
            toast("Não foi possível carregar as secretarias, tente novamente mais tarde")
            return null
        }
    }

    function handleOnSelect(event: ChangeEvent<HTMLSelectElement>) {
        onSecretariaChange(event.target.value as Secretarias)
    }

    useEffect(() => {
        fetchSecretarias().then(secretarias => setSecretarias(secretarias))
    }, [])

    return (
        <div>
            <label htmlFor="secretaria-select" className="block text-sm font-medium text-gray-700 mb-1">Secretaria</label>

            <div className="relative">
                <select id="secretaria-select" onChange={handleOnSelect} className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
                    <option value="todas">Todas</option>

                    {secretarias?.map(sec => {
                        return (
                            <option key={sec.id} value={sec.name}>{sec.name}</option>
                        )
                    })}
                </select>

                <ArrowDown />
            </div>
        </div>
    )
}