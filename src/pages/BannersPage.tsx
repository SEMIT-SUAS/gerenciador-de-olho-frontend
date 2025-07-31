import { Input } from '@/components/ui/input';
import { LayoutPage } from './LayoutPage';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEffect, useState } from 'react';
import type { Banner } from '@/types/Banner';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from '@/components/ui/pagination';

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[] | null>(null);

  useEffect(() => {
    setBanners([
      {
        id: 1,
        nome: 'Lula ladrão',
        to: 'https://saoluis.ma.gov.br',
        isVisible: true,
        createdAt: new Date().toISOString(),
      },
    ]);

    return () => {
      setBanners(null);
    };
  }, []);

  return (
    <LayoutPage additionalStyles="px-[39px]">
      <div className="flex flex-col gap-6 py-8 px-36">
        <div className="w-[50%]">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Banners
          </h3>
          <p className="text-slate-600 text-xs">
            Gerencie com precisão todas as Personas para serviços da prefeitura.
            Tenha controle total para adicionar, visualizar, editar e remover
            cada órgão, garantindo informações sempre atualizadas e acessíveis.
          </p>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Input placeholder="Pesquise um nome" className="w-[320px]" />

          <Button variant="outline" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Adicionar banner
          </Button>
        </div>

        <Table className="">
          <TableHeader className="">
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {banners?.map((banner) => {
              return (
                <TableRow key={banner.id}>
                  <TableCell>
                    <img src="/logo_slz_sem_fundo.png" alt={banner.nome} />
                  </TableCell>
                  <TableCell>{banner.nome}</TableCell>
                  <TableCell>{banner.to}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button>
                        <IconEdit stroke={2} />
                      </button>

                      <button>
                        <IconEye stroke={2} />
                      </button>

                      <button>
                        <IconTrash stroke={2} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <div className="flex items-center gap-5">
          <div>Linhas por página: </div>

          <Pagination>
            <PaginationContent>{banners?.length}</PaginationContent>
          </Pagination>
        </div>
      </div>
    </LayoutPage>
  );
}
