import type { StatusModel } from "../../types/StatusModel"
import { StatusButton } from "./StatusButton"

type FilterButtonsProps = {
    setFilterStatus: (filter: 'todos' | StatusModel) => void
    currentFilter: 'todos' | StatusModel
}

type buttonsProps = {
    text: string,
    status: 'todos' | StatusModel
}

const buttons: buttonsProps[] = [
    {
        text: 'Todas',
        status: 'todos'
    },
    {
        text: 'Em andamento',
        status: 'em_andamento'
    },
    {
        text: 'Indeferidas',
        status: 'indeferido'
    },
    {
        text: 'Concluidas',
        status: 'concluido'
    }
]

export function FilterButtons({ setFilterStatus, currentFilter }: FilterButtonsProps) {
    return (
        <>
          {buttons.map(btn => {
            return <StatusButton
              key={btn.status}
              text={btn.text}
              isSelected={currentFilter == btn.status}
              onClick={() => setFilterStatus(btn.status)}
            />
          })}
        </>
    )
}