import type { FC, ReactNode } from 'react'
import { FaArrowLeft } from 'react-icons/fa' // Supondo que você use react-icons

interface BackButtonProps {
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}

export const BackButton: FC<BackButtonProps> = ({ onClick, children, className }) => {
  const finalClassName = `self-start flex items-center mb-4 text-sm text-white px-3 py-2 rounded-full bg-blue-500 font-semibold hover:bg-blue-600 transition-colors ${className || ''}`

  return (
    <button onClick={onClick} className={finalClassName}>
      <FaArrowLeft className="inline-block mr-2" />
      {children || 'Voltar'}
    </button>
  )
}
