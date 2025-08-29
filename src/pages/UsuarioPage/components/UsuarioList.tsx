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
import { RenderIf } from '@/components/RenderIf';
import { ImageSkeleton } from '@/components/Loading/ImageSkeleton';
import { ListItemSkeleton } from '@/components/Loading/ListItemSkeleton';
import { IconUsers } from '@tabler/icons-react';

interface UsuariosListProps {
  usuarios: UsuarioModel[];
  setUsuarios: Dispatch<SetStateAction<UsuarioModel[]>>;
  onEdit: (usuario: UsuarioModel) => void;
  onDelete: (usuario: UsuarioModel) => void;
  itemsPerPage: number;
}

export function UsuariosList({
  usuarios,
  setUsuarios,
  onEdit,
  onDelete,
  itemsPerPage,
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
          {usuarios ? (
            <RenderIf
              condition={usuarios.length > 0}
              ifRender={usuarios.map((usuario) => (
                <UsuariosListItem
                  key={usuario.id}
                  usuario={usuario}
                  setUsuarios={setUsuarios}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
              elseRender={
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <IconUsers className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Nenhum usuário encontrado
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
                  <ListItemSkeleton titleWidth="3/4" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ListItemSkeleton titleWidth="1/2" className="p-0 border-0" />
                </TableCell>

                <TableCell className="border-r">
                  <ImageSkeleton
                    height={20}
                    width={60}
                    className="rounded-full"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <ImageSkeleton
                      height={18}
                      width={18}
                      className="rounded-full"
                    />
                    <ImageSkeleton
                      height={18}
                      width={18}
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
