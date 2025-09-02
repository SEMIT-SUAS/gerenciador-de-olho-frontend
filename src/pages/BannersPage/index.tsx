import { LayoutPage } from '@/components/LayoutPage';
import { useEffect, useState } from 'react';
import type { BannerModel } from '@/types/Banner';
import { toast } from 'sonner';
import { AddBannerModal } from './components/AddBannerModal';
import { BannersList } from './components/BannersList';
import { Pagination } from '@/components/Pagination';

import { BannerService } from '@/services/bannersService';
import PageHeader from '@/components/PageHeader';
import { TableHeaderActions } from '@/components/TableHeaderActions';

export function BannersPage() {
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [banners, setBanners] = useState<BannerModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenAddBannerModal, setIsOpenAddBannerModal] = useState(false);

  async function loadBanners() {
    try {
      setBanners([]);
      const bannersData = await new BannerService().getAll();
      setBanners(bannersData);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
      <LayoutPage>
        <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
          <PageHeader
            title="Banners"
            description="Organize e mantenha o controle dos banners utilizados nos serviços da prefeitura, promovendo eficiência e transparência na comunicação."
          />
          <TableHeaderActions
            searchValue={searchTerm}
            onSearchChange={handleSearch}
            buttonText="Adicionar banner"
            onButtonClick={() => setIsOpenAddBannerModal(true)}
          />
          <BannersList
            itemsPerPage={itemsPerPage}
            banners={currentBanners}
            setBanners={setBanners}
            reloadBanners={loadBanners}
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
        reloadBanners={loadBanners}
      />
    </>
  );
}
