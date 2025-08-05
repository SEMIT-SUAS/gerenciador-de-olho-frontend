import { SearchInput } from '@/components/ui/input';
import { LayoutPage } from './LayoutPage';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
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
import { AddBannerModal } from '@/components/Banners/Modals/AddBannerModal';
import { BannersList } from '@/components/Banners/BannersList';

export function BannersPage() {
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [banners, setBanners] = useState<BannerModel[] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenAddBannerModal, setIsOpenAddBannerModal] = useState(false);

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
              onClick={() => setIsOpenAddBannerModal(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Adicionar banner
            </Button>
          </div>

          <BannersList
            itemsPerPage={itemsPerPage}
            searchTerm={searchTerm}
            banners={currentBanners}
            setBanners={setBanners}
          />

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

      <AddBannerModal
        isOpen={isOpenAddBannerModal}
        onClose={() => setIsOpenAddBannerModal(false)}
        setBanners={setBanners}
      />
    </>
  );
}
