import { useEffect, useState } from 'react';
import type { Portais } from '@/types/Portais';
import { portalService } from '@/services/PortaisService';
import { toast } from 'sonner';

import { PortaisList } from '@/pages/PortaisPage/components/PortaisList';
import { LayoutPage } from '../../components/LayoutPage';
import { AddPortalModal } from '@/pages/PortaisPage/components/AddPortalModal';
import PageHeader from '@/components/PageHeader';
import { TableHeaderActions } from '@/components/TableHeaderActions';
import { Pagination } from '@/components/Pagination';

export function PortaisPage() {
  const [portais, setPortais] = useState<Portais[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isFormOpen, setIsFormOpen] = useState(false);

  async function getAllPortaisData() {
    try {
      return await portalService.getAll();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar os portais.');
    }
  }

  useEffect(() => {
    getAllPortaisData().then((portaisData) => {
      if (portaisData) {
        setPortais(portaisData);
      }
    });

    return () => {
      setPortais([]);
    };
  }, []);

  const filteredPortais = portais?.filter((portal) =>
    portal.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil((filteredPortais?.length ?? 0) / itemsPerPage);

  const currentPortais = portais
    ? filteredPortais?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ) || []
    : [];

  const itemsPerPageOptions = [5, 10, 15, 20];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <PageHeader
          title="Portais"
          description="Gerencie os portais de serviços disponíveis na plataforma, assegurando que estejam sempre atualizados e prontos para uso."
        />
        <TableHeaderActions
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          buttonText="Adicionar Portal"
          onButtonClick={() => setIsFormOpen(true)}
        />
        <PortaisList
          itemsPerPage={itemsPerPage}
          portais={currentPortais}
          setPortais={setPortais}
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
      <AddPortalModal
        open={isFormOpen}
        onOpenChange={(isFormOpen) => {
          if (!isFormOpen) {
            setIsFormOpen(false);
          }
        }}
        setPortais={setPortais}
      />
    </LayoutPage>
  );
}
