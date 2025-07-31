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

  const finalClassName = `flex items-center p-1.5 text-gray-300 rounded-md border border-gray-300 hover:bg-gray-300 hover:text-white transition-colors`;

  const textButton = 'text-gray-800 ml-2 font-bold text-xl';

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
    <button onClick={handleGoBack} className="flex items-center">
      <span className={finalClassName}>
        <FaArrowLeft />
      </span>
      <span className={textButton}>{children}</span>
    </button>
  );
}
