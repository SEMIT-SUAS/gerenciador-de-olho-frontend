import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Secretaria } from '@/types/Secretaria'; // ajuste para o caminho correto
import type { Dispatch, SetStateAction } from 'react';
import { SecretariaListItem } from './SecretariaListItem'; // ajuste o caminho conforme necessário

interface SecretariaListProps {
  secretarias: Secretaria[];
  setSecretarias: Dispatch<SetStateAction<Secretaria[]>>;
}

export function SecretariaList({
  secretarias,
  setSecretarias,
}: SecretariaListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Sigla</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(secretarias) &&
            secretarias.map((secretaria) => (
              <SecretariaListItem
                key={secretaria.id}
                secretaria={secretaria}
                setSecretarias={setSecretarias}
              />
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
