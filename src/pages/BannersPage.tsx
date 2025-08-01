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
import type { BannerModel } from '@/types/Banner';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import bannersService from '@/services/bannersService';
import { toast } from 'react-toastify';
import { BannerListItem } from '@/components/Banners/BannerListItem';
import { SkeletonItem } from '@/components/Loading/SkeletonItem';
import { SkeletonImage } from '@/components/Loading/SkeletonImage';
import { RenderIf } from '@/components/RenderIf';
import { CreateBannerModal } from '@/components/Banners/Modals/CreateBannerModal';

export function BannersPage() {
  const [banners, setBanners] = useState<BannerModel[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenCreateBannerModal, setIsOpenCreateBannerModal] = useState(false);

  async function getAllBanners() {
    try {
      return await bannersService.getAll();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getAllBanners().then((bannersData) => {
      if (bannersData) {
        setBanners(bannersData);
      }
    });

    return () => {
      setBanners(null);
    };
  }, []);

  const filteredBanners = banners?.filter((banner) =>
    banner.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil((filteredBanners?.length ?? 0) / itemsPerPage);
  const currentBanners =
    filteredBanners?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const itemsPerPageOptions = [8, 16, 24];

  return (
    <>
      <LayoutPage additionalStyles="px-[39px]">
        <div className="flex flex-col gap-6 py-8 px-36">
          <div className="w-[50%]">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Banners
            </h3>
            <p className="text-slate-600 text-xs">
              Gerencie com precisão todas as Personas para serviços da
              prefeitura. Tenha controle total para adicionar, visualizar,
              editar e remover cada órgão, garantindo informações sempre
              atualizadas e acessíveis.
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

            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setIsOpenCreateBannerModal(true)}
            >
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
              {banners ? (
                <RenderIf
                  condition={currentBanners.length > 0}
                  ifRender={currentBanners?.map((banner) => (
                    <BannerListItem key={banner.id} banner={banner} />
                  ))}
                  elseRender={
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center">
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? `Nenhum resultado para "${searchTerm}"`
                            : 'Nenhum banner encontrado'}
                        </p>
                      </TableCell>
                    </TableRow>
                  }
                />
              ) : (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`}>
                    <TableCell className="border-r">
                      <div className="flex items-center gap-3">
                        <SkeletonImage
                          height={40}
                          width={40}
                          className="rounded"
                        />
                        <SkeletonItem
                          titleWidth="20"
                          className="p-0 border-0"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="border-r">
                      <SkeletonItem titleWidth="3/4" className="p-0 border-0" />
                    </TableCell>
                    <TableCell className="border-r">
                      <SkeletonItem titleWidth="1/2" className="p-0 border-0" />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-4">
                        <SkeletonImage
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <SkeletonImage
                          height={24}
                          width={24}
                          className="rounded-full"
                        />
                        <SkeletonImage
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

      <CreateBannerModal
        isOpen={isOpenCreateBannerModal}
        onClose={() => setIsOpenCreateBannerModal(false)}
      />
    </>
  );
}
