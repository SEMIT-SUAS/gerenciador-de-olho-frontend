import type { Dispatch, SetStateAction } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import type { Persona } from '@/types/Persona';
import { PersonaListItem } from './PersonaListItem';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconUser } from '@tabler/icons-react';
import { RenderIf } from '@/components/RenderIf';

interface PersonasListProps {
  personas: Persona[];
  setPersonas: Dispatch<SetStateAction<Persona[]>>;
  onEdit?: (persona: Persona) => void;
  itemsPerPage: number;
}

export function PersonasList({
  personas,
  setPersonas,
  onEdit,
  itemsPerPage,
}: PersonasListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Ícone</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {personas ? (
            <RenderIf
              condition={personas.length > 0}
              ifRender={personas
                .filter((persona) => persona.ativo)
                .map((persona) => (
                  <PersonaListItem
                    key={persona.id}
                    persona={persona}
                    setPersonas={setPersonas}
                    onEdit={onEdit}
                  />
                ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={3} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconUser className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhuma persona encontrada
                      </h3>
                    </div>
                  </TableCell>
                </TableRow>
              }
            />
          ) : (
            Array.from({ length: itemsPerPage }).map((_, idx) => (
              <TableRow key={`skeleton-${idx}`}>
                <TableCell className="border-r">
                  <div className="flex items-center justify-center">
                    <ImageSkeleton height={40} width={40} className="rounded" />
                  </div>
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <ImageSkeleton
                      height={24}
                      width={24}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={24}
                      width={24}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={24}
                      width={24}
                      className="rounded-full"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
