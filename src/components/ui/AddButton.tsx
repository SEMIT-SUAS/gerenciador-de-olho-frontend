import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';

export function AddButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const isDenunciasPage = pathname.startsWith('/ocorrencias/denuncias');
  const isAcoesPage = pathname.startsWith('/ocorrencias/acoes');
  const isDetailPage = /\/(denuncias|acoes)\/\d+/.test(pathname);

  if (isDetailPage || (!isDenunciasPage && !isAcoesPage)) {
    return null;
  }

  const isAdding = pathname.endsWith('/add');

  function handleOnClickButton() {
    if (isAdding) {
      const canGoBack = location.key !== 'default';
      if (canGoBack) {
        navigate(-1);
      } else {
        const basePath = pathname.replace('/add', '');
        navigate(basePath);
      }
    } else {
      navigate(`${location.pathname}/add`);
    }
  }

  return (
    <button
      onClick={handleOnClickButton}
      aria-label={isAdding ? 'Cancelar adição' : 'Adicionar ocorrência'}
      className="p-1 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {isAdding ? (
        <IoIosClose size={36} color="white" />
      ) : (
        <IoIosAdd size={36} color="white" />
      )}
    </button>
  );
}
