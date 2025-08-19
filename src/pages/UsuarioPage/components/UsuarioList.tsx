// src/pages/UsuariosPage/components/UsuariosList.tsx

import { type Dispatch, type SetStateAction } from 'react';
import type { UsuarioLogin } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UsuariosListItem } from './UsuarioListItem';

interface UsuariosListProps {
  usuarios: UsuarioLogin[];
  setUsuarios: Dispatch<SetStateAction<UsuarioLogin[]>>;
}

export function UsuariosList({ usuarios, setUsuarios }: UsuariosListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Secretaria</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead className="w-[10%]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usuarios.length > 0 ? (
            usuarios.map((usuario) => (
              <UsuariosListItem
                key={usuario.id}
                usuario={usuario}
                setUsuarios={setUsuarios}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum usuário encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
