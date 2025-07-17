import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import type { Secretaria, Secretarias } from "../../../types/Secretaria"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select" 

type SelectSecretariaFilterProps = {
    onSecretariaChange: (secretaria: Secretarias) => void
}

export function SelectSecretariaFilter({ onSecretariaChange }: SelectSecretariaFilterProps) {
    const [secretarias, setSecretarias] = useState<Secretaria[] | null>(null)

    useEffect(() => {
        async function fetchSecretarias(): Promise<void> {
            try {
                const data: Secretaria[] = [
                    { id: 1, name: 'SEMMAM' },
                    { id: 2, name: 'SEMOSP' },
                    { id: 3, name: 'SEMURH' },
                ];
                setSecretarias(data);
            } catch {
                toast.error("Não foi possível carregar as secretarias, tente novamente mais tarde");
            }
        }

        fetchSecretarias();
    }, [])

    return (
        <div>
            <label htmlFor="secretaria-select" className="block text-sm font-medium text-gray-700 mb-1">
                Secretaria
            </label>

            <Select
                onValueChange={onSecretariaChange}
                defaultValue="todas"
                disabled={!secretarias} 
            >
                <SelectTrigger id="secretaria-select" className="w-full">
                    <SelectValue placeholder="Selecione uma secretaria..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>

                    {secretarias?.map(sec => (
                        <SelectItem key={sec.id} value={sec.name}>
                            {sec.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}