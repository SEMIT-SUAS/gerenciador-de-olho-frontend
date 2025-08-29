import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { EspacoPublicoItem } from './EspacoPublicoItem';
import { RenderIf } from '../../../components/RenderIf';
import { Skeleton } from '../../../components/ui/skeleton';
import type { Dispatch, SetStateAction } from 'react';
import { IconWorld } from '@tabler/icons-react';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';

interface EspacosPublicosListProps {
  espacosPublicos: EspacoPublicoModel[] | null;
  setEspacosPublicos: Dispatch<SetStateAction<EspacoPublicoModel[]>>;
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
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-2 p-4 border rounded-md"
          >
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <ImageSkeleton height={20} width={60} className="rounded-full" />

            <div className="flex gap-2">
              <ImageSkeleton height={18} width={18} className="rounded-full" />
              <ImageSkeleton height={18} width={18} className="rounded-full" />
              <ImageSkeleton height={18} width={18} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-5 gap-6">
      <RenderIf
        condition={espacosPublicos.length === 0}
        ifRender={
          <div className="col-span-5 flex flex-col items-center justify-center space-y-2">
            <IconWorld className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">
              Nenhum espaço público encontrado.
            </h3>
          </div>
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
