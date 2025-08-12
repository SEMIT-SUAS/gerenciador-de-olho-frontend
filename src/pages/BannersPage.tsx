import { SearchInput } from '@/components/ui/input';
import { LayoutPage } from './LayoutPage';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { BannerModel } from '@/types/Banner';
import { toast } from 'react-toastify';
import { AddBannerModal } from '@/components/Banners/Modals/AddBannerModal';
import { BannersList } from '@/components/Banners/BannersList';
import { Pagination } from '@/components/Pagination';

import bannersService from '@/services/bannersService';

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

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-[320px]">
              <SearchInput
                placeholder="Pesquise pelo nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button
              variant={'outline'}
              className="flex items-center gap-2"
              onClick={() => setIsOpenAddBannerModal(true)}
            >
              <PlusIcon className="h-4 w-4" />
              Adicionar banner
            </Button>
          </div>

          <BannersList
            itemsPerPage={itemsPerPage}
            banners={currentBanners}
            setBanners={setBanners}
          />

          <Pagination
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPageOptions={itemsPerPageOptions}
          />
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
