import { ArrowLeft } from 'lucide-react';
import { type ReactNode } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  fallback?: string;
  children?: ReactNode;
  className?: string;
}

export function BackButton({ to, fallback = '/', children }: BackButtonProps) {
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

export function DashboardBackButton() {
  return (
    <Link
      to="/dashboard"
      className="absolute top-5 left-12 z-40 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 transition-colors"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      Voltar para o Dashboard
    </Link>
  );
}
