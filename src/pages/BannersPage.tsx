import { SearchInput } from '@/components/ui/input';
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
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setBanners([
      {
        id: 1,
        nome: 'Trânsito e Transporte',
        to: 'https://saoiuis.prefeitura.com.br',
        isVisible: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        nome: 'Trânsito e Transporte',
        to: 'https://saoiuis.prefeitura.com.br',
        isVisible: true,
        createdAt: new Date().toISOString(),
      },
      ...Array.from({ length: 82 }, (_, i) => ({
        id: i + 3,
        nome: `Trânsito e Transporte ${i + 3}`,
        to: 'https://saoiuis.prefeitura.com.br',
        isVisible: true,
        createdAt: new Date().toISOString(),
      })),
    ]);
  }, []);

  const filteredBanners = banners.filter((banner) =>
    banner.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const currentBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const itemsPerPageOptions = [8, 16, 24];

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
          <div className="relative w-[320px]">
            <SearchInput
              placeholder="Pesquise um nome"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Button variant="outline" className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Adicionar banner
          </Button>
        </div>

        <Table className="rounded-md overflow-hidden border border-solid shadow-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentBanners.map((banner) => (
              <TableRow key={banner.id}>
                <TableCell>
                  <img
                    src="/logo_slz_sem_fundo.png"
                    alt={banner.nome}
                    className="h-10 w-auto"
                  />
                </TableCell>
                <TableCell>{banner.nome}</TableCell>
                <TableCell>
                  <a
                    href={banner.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {banner.to}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <button className="text-blue-500 hover:text-blue-700">
                      <IconEye stroke={2} size={18} />
                    </button>
                    <button className="text-green-500 hover:text-green-700">
                      <IconEdit stroke={2} size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <IconTrash stroke={2} size={18} />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Linhas por página:</span>

            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {itemsPerPageOptions.map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <IconChevronsLeft stroke={2} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <IconChevronLeft stroke={2} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <IconChevronRight />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <IconChevronsRight stroke={2} />
            </Button>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
