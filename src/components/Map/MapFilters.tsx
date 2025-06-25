import { useOcorrencias, type filterProps } from "../../hooks/useOcorrencias";

type MapFiltersProps = {
    setFilter: React.Dispatch<React.SetStateAction<filterProps>>
}

export function MapFilters({ setFilter }: MapFiltersProps) {
    return (
        <div className="absolute top-4 right-4 z-20">
            <div className="flex-1 min-w-[180px]">
                <label htmlFor="filtro-tipo" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo
                </label>

                <div className="relative">
                    <select
                        id="filtro-tipo"
                        className='appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out'
                        onChange={e => setFilter(current => ({
                            status: current.status,
                            mapPins: e.target.value as 'all'
                        }))}
                    >
                        <option value="all">Todos os Tipos</option>
                        <option value="denuncias">Denúncias</option>
                        <option value="acoes">Ações</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-w-[180px]">
                <label htmlFor="filtro-status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <div className="relative">
                    <select
                        id="filtro-status"
                        className='appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ease-in-out'
                        onChange={e => setFilter(current => ({
                            status: e.target.value as 'all',
                            mapPins: current.mapPins
                        }))}
                    >
                        <option value="all">Todos os Status</option>
                        <option value="aberto">Abertas</option>
                        <option value="em_andamento">Em andamento</option>
                        <option value="indeferido">Indeferidas</option>
                        <option value="concluido">Concluídas</option>
                    </select>

                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

        </div>
    );
}