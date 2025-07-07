import type { StatusModel } from "../../types/StatusModel";

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

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
        </div>
    )
}