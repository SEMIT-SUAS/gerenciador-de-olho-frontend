import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { EspacoPublicoItem } from './EspacoPublicoItem';
import { RenderIf } from '../RenderIf';
import { Skeleton } from '../ui/skeleton';
import type { Dispatch, SetStateAction } from 'react';

interface EspacosPublicosListProps {
  espacosPublicos: EspacoPublicoModel[] | null;
  setEspacosPublicos: Dispatch<SetStateAction<EspacoPublicoModel[] | null>>;
  itensPerPage: number;
}

export function EspacosPublicosList({
  espacosPublicos,
  itensPerPage,
  setEspacosPublicos,
}: EspacosPublicosListProps) {
  if (!espacosPublicos)
    return (
      <div className="grid grid-cols-5 gap-6">
        {Array.from({ length: itensPerPage }).map((_, index) => (
          <Skeleton key={index} className="" />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-5 gap-6">
      <RenderIf
        condition={espacosPublicos.length === 0}
        ifRender={
          <p className="col-span-5 text-center">
            Nenhum espaço público encontrado.
          </p>
        }
        elseRender={espacosPublicos.map((espaco) => (
          <EspacoPublicoItem
            key={espaco.id}
            espacoPublico={espaco}
            setEspacosPublicos={setEspacosPublicos}
          />
        ))}
      />
    </div>
  );
}
