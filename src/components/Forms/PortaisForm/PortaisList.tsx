  // src/components/portais/PortaisList.tsx

import { useState, type Dispatch, type SetStateAction } from 'react';
import type { Portais } from '@/types/Portais';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PortaisListItem } from './PortaisListItem';

interface PortaisListProps {
  portais: Portais[];
  setPortais: Dispatch<SetStateAction<Portais[]>>;
}



export function PortaisList({ portais, setPortais }: PortaisListProps) {
  return (
    <div className="rounded-md border">
      <Table className='table-fixed'>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[40%]'>Nome</TableHead>
            <TableHead className='w-[30%]'>Link</TableHead>
            <TableHead className='w-[20%]'>Destaque</TableHead>
            <TableHead className='w-[10%]'>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portais.length > 0 ? (
            portais.filter(p => p.ativo).map((portal) => (
              <PortaisListItem
                key={portal.id}
                portal={portal}
                setPortais={setPortais}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum portal encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}