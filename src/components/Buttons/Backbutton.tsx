import { type ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  fallback?: string;
  children?: ReactNode;
  className?: string;
}

export function BackButton({
  to,
  fallback = '/',
  children,
  className,
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const finalClassName = `self-start flex items-center text-sm text-white px-3 py-2 rounded-full bg-blue-500 font-semibold hover:bg-blue-600 transition-colors ${
    className || ''
  }`;

  function handleGoBack() {
    if (to) {
      navigate(to);
      return;
    }

    const canGoBack = location.key !== 'default';

    if (canGoBack) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <button onClick={handleGoBack} className={finalClassName}>
      <FaArrowLeft className="inline-block mr-2" />
      {children || 'Voltar'}
    </button>
  );
}
