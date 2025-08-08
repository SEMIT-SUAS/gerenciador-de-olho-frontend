import { ImSpinner2 } from 'react-icons/im';

export function MapLoading() {
  return (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <div className="text-center">
        <ImSpinner2 className="animate-spin h-8 w-8 text-gray-500 mx-auto" />
        <p className="text-gray-500 font-semibold mt-2">Carregando mapa...</p>
      </div>
    </div>
  );
}
