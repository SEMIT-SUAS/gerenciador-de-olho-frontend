import { useEffect, useState } from 'react';
import type { Portais } from '@/types/Portais';
import { portalService } from '@/services/PortaisService';
import { toast } from 'sonner';

import { PortaisList } from '@/pages/PortaisPage/components/PortaisList';
import { LayoutPage } from '../../components/LayoutPage';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';
import { AddPortalModal } from '@/pages/PortaisPage/components/AddPortalModal';

export function PortaisPage() {
  const [portais, setPortais] = useState<Portais[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleUpdatePortal = (updatedPortal: Portais) => {
    setPortais((currentPortais) =>
      currentPortais.map((p) =>
        p.id === updatedPortal.id ? updatedPortal : p,
      ),
    );
  };

  // --- (NOVO) Função para lidar com a exclusão de um item ---
  const handleDeletePortal = (portalId: number | string) => {
    setPortais((currentPortais) =>
      currentPortais.filter((p) => p.id !== portalId),
    );
  };

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

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Portais</h2>
          <p className="text-slate-600 text-xs sm:text-xs mt-1">
            Gerencie os portais de serviços disponíveis na plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <div className="w-full sm:w-[280px] md:w-[320px]">
            <SearchInput
              placeholder="Pesquise por nome do portal"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFormOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Adicionar Portal
            </Button>
          </div>
        </div>

        <PortaisList
          itemsPerPage={itemsPerPage}
          portais={currentPortais}
          setPortais={setPortais}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-sm text-gray-600">
              Linhas por página:
            </span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                {[8, 16, 24].map((option) => (
                  <SelectItem key={option} value={option.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página {totalPages > 0 ? currentPage : 0} de {totalPages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
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
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
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
