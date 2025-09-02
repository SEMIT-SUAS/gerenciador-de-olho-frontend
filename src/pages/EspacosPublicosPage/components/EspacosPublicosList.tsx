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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {Array.from({ length: itensPerPage }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center space-y-2 p-3 sm:p-4 border rounded-md bg-white shadow-sm"
          >
            <ImageSkeleton
              height={120}
              width="100%"
              className="rounded-md mb-2"
            />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-6 w-16 rounded-full" />

            <div className="flex gap-2 pt-2">
              <ImageSkeleton height={16} width={16} className="rounded-full" />
              <ImageSkeleton height={16} width={16} className="rounded-full" />
              <ImageSkeleton height={16} width={16} className="rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
      <RenderIf
        condition={espacosPublicos.length === 0}
        ifRender={
          <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-5 flex flex-col items-center justify-center space-y-2 py-8 sm:py-12">
            <IconWorld className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 dark:text-gray-500 mx-auto" />
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
