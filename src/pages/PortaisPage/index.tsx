// src/pages/PortaisPage.tsx

import { useEffect, useState, useMemo } from 'react';
import type { Portais } from '@/types/Portais'; // Ajuste o caminho se necessário
import { getAllPortais } from '@/services/PortaisService'; // Ajuste o caminho se necessário
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<Portais | undefined>(
    undefined,
  );

  async function fetchPortais() {
    try {
      setLoading(true);
      const data = await getAllPortais();
      setPortais(data);
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao buscar os portais.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPortais();
  }, []);

  const filteredPortais = useMemo(() => {
    return portais.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [portais, searchTerm]);

  const totalPages = Math.ceil(filteredPortais.length / itemsPerPage);

  const currentData = useMemo(() => {
    return filteredPortais.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    );
  }, [filteredPortais, currentPage, itemsPerPage]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  if (loading) {
    return (
      <LayoutPage>
        <div className="flex items-center justify-center min-h-[400px]">
          Carregando...
        </div>
      </LayoutPage>
    );
  }

  if (error) {
    return (
      <LayoutPage>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-red-600">Erro: {error}</p>
          <Button onClick={fetchPortais} variant="outline">
            Tentar novamente
          </Button>
        </div>
      </LayoutPage>
    );
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

        <PortaisList portais={currentData} setPortais={setPortais} />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Linhas por página:</span>
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
