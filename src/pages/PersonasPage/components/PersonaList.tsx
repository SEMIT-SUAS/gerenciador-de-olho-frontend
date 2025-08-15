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

interface PersonasListProps {
  personas: Persona[];
  setPersonas: Dispatch<SetStateAction<Persona[]>>;
  onEdit?: (persona: Persona) => void;
}

export function PersonasList({
  personas,
  setPersonas,
  onEdit,
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
          {Array.isArray(personas) && personas.length > 0 ? (
            personas
              .filter((persona) => persona.ativo)
              .map((persona) => (
                <PersonaListItem
                  key={persona.id}
                  persona={persona}
                  setPersonas={setPersonas}
                  onEdit={onEdit}
                />
              ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                Nenhuma persona encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
