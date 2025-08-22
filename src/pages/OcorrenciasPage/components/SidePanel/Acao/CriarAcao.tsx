import { BackButton } from '@/components/ui/Backbutton.tsx';
import { CriarAcaoForm } from './CriarAcaoForm/index.tsx';
import { useMapActions } from '@/context/MapActions.tsx';
import { Navigate } from 'react-router-dom';

export function CriarAcao() {
  const { currentBairroId } = useMapActions();

  if (!currentBairroId) {
    return <Navigate to="/ocorrencias" />;
  }

  const backButton = <BackButton to="/ocorrencias" children="Criar Ação" />;

  return (
    <div className="flex flex-col h-full space-y-7">
      {backButton}

      <CriarAcaoForm />
    </div>
  );
}
