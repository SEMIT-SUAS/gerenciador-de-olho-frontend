type StatusButtonProps = {
    text: string
    isSelected: boolean
    onClick: () => void
}

export function StatusButton({ text, isSelected, onClick }: StatusButtonProps) {
    const additionalStyle = isSelected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

    return (
        <button
            onClick={onClick}
            className={`px-2 py-1 rounded-md transition-colors ${additionalStyle}`}
        >
            {text}
        </button>
    )
}