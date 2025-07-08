import type { StatusModel } from "../../../types/StatusModel";
import { ArrowDown } from "../../ArrowDown";

const statusOptions = [
    { text: 'Todos', value: 'todos' },
    { text: 'Aberto', value: 'aberto' },
    { text: 'Em andamento', value: 'em_andamento' },
    { text: 'Indeferidas', value: 'indeferido' },
    { text: 'Concluídas', value: 'concluido' }
];

type FilterStatusSelectProps = {
    id: string;
    label: string;
    value: string;
    onStatusChange: (status: 'todos' | StatusModel) => void;
}

export function FilterStatusSelect({ id, label, value, onStatusChange }: FilterStatusSelectProps) {
    const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onStatusChange(event.target.value as 'todos' | StatusModel);
    };

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <select
                    id={id}
                    value={value}
                    onChange={handleOnChange}
                    className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                >
                    {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.text}
                        </option>
                    ))}
                </select>

                <ArrowDown />
            </div>
        </div>
    )
}