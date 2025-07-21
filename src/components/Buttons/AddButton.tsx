import { IoIosAdd, IoIosClose } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';

export function AddButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDenuncia = location.pathname.includes('denuncias');
  const isAdding = location.pathname.endsWith('/add');

  function handleOnClickButton() {
    navigate(
      isAdding
        ? `${isDenuncia ? '/ocorrencias/denuncias' : '/ocorrencias/acoes'}`
        : `${location.pathname}/add`,
    );
  }

  return (
    <button
      onClick={handleOnClickButton}
      aria-label={'Adicionar denúncia ou cria ação'}
      className={`p-1 rounded-full bg-blue-600 cursor-pointer`}
    >
      {isAdding ? (
        <IoIosClose size={36} color="white" />
      ) : (
        <IoIosAdd size={36} color="white" />
      )}
    </button>
  );
}
