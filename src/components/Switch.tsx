type SwitchProps = {
  isActive: boolean,
  onToogle: () => void
}

export function Switch({ isActive, onToogle }: SwitchProps) {
  const bgColor = isActive
    ? 'bg-green-500'
    : 'bg-red-500'

  const position = isActive
    ? 'translate-x-6'
    : 'translate-x-0'

  return (
    <button
      role="switch"
      aria-checked={isActive}
      onClick={onToogle}
      className={`
        w-14 h-8 p-1 rounded-full 
        flex items-center cursor-pointer
        transition-colors duration-300 ease-in-out
        ${bgColor}
      `}
    >
      <span className="sr-only">
        {isActive
          ? 'Ativado'
          : 'Desativado'}
      </span>
      <div
        className={`
          w-6 h-6 bg-white rounded-full shadow-md
          transform transition-transform duration-300 ease-in-out
          ${position}
        `}
      />
    </button>
  )
}
