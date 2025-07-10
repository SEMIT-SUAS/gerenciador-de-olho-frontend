import type { ZoomToProps } from '../../../pages/OcorrenciasPage';
import type { Denuncia } from '../../../types/Denuncia';
import { DenunciaItem } from './DenunciaItem';

type DenunciasListProps = {
  denuncias: Denuncia[];
  onItemClick: (item: Denuncia, zoomToData: ZoomToProps) => void;
};

export function DenunciasList({ denuncias, onItemClick }: DenunciasListProps) {
  const isEmpty = denuncias.length < 1;

  if (isEmpty) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Nenhuma denúncia encontrada.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {denuncias.map((denuncia) => {
        return (
          <DenunciaItem
            key={denuncia.id}
            denuncia={denuncia}
            onClick={() =>
              onItemClick(denuncia, {
                lat: denuncia.endereco.latitude,
                lng: denuncia.endereco.longitude,
              })
            }
            showTag={true}
            showDescription={true}
            isDeletable={false}
          />
        );
      })}
    </div>
  );
}
