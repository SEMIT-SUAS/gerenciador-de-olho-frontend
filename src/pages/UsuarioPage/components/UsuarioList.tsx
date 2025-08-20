// src/pages/UsuariosPage/components/UsuariosList.tsx

import { type Dispatch, type SetStateAction } from 'react';
import type { UsuarioModel } from '@/types/Usuario';
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
  usuarios: UsuarioModel[];
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[]>>;
  onEdit: (usuario: UsuarioModel) => void;
  onDelete: (usuario: UsuarioModel) => void; // Recebe a função do pai
}

export function UsuariosList({
  usuarios,
  setUsuarios,
  onEdit,
  onDelete,
}: UsuariosListProps) {
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
                onEdit={onEdit}
                onDelete={onDelete} // Passa a função para o componente filho
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
