import { useEffect } from 'react';
import { AddDenunciaForm } from '../../Forms/AddDenunciaForm';
import { useMapActions } from '../../../context/MapActions';
import { useFilters } from '../../../context/FiltersContext';

export function AddDenuncia() {
  const { setDisableMapFilters } = useMapActions();
  const {} = useFilters();

  useEffect(() => {
    setDisableMapFilters(true);

    return () => {
      setDisableMapFilters(false);
    };
  }, []);

  return (
    <div>
      <AddDenunciaForm />
    </div>
  );
}
