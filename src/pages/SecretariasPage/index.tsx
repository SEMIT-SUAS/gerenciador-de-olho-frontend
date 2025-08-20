import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Secretaria } from '../../types/Secretaria';
import { getAllSecretarias } from '../../services/secretariaService';
import { SecretariaList } from './components/SecretariaList';
import { SecretariaFormModal } from './components/SecretariaModalForm';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LayoutPage } from '@/components/LayoutPage';
import { Plus } from 'lucide-react';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from '@tabler/icons-react';

export function SecretariaPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function fetchSecretarias() {
    try {
      setLoading(true);
      const data = await getAllSecretarias();
      setSecretarias(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar as secretarias.');
      toast.error(err.message || 'Erro ao buscar as secretarias.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSecretarias();
  }, []);

  const filteredSecretarias = secretarias.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const itemsPerPageOptions = [8, 16, 24];
  const totalPages = Math.ceil(filteredSecretarias.length / itemsPerPage);

  const currentData = filteredSecretarias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    fetchSecretarias();
  };

  if (error) {
    return (
      <LayoutPage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600">Erro: {error}</p>
            <Button
              onClick={fetchSecretarias}
              variant="outline"
              className="mt-4"
            >
              Tentar novamente
            </Button>
          </div>
        </div>
      </LayoutPage>
    );
  }

  if (loading) {
    return (
      <LayoutPage>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-600">Carregando secretarias...</p>
        </div>
      </LayoutPage>
    );
  }

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        {/* Cabeçalho */}
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Secretarias</h2>
          <p className="text-slate-600 text-xs sm:text-xs mt-1">
            Gerencie com precisão todas as Secretarias da prefeitura. Tenha
            controle total para adicionar, visualizar, editar e remover cada
            órgão, garantindo informações sempre atualizadas e acessíveis.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <div className="w-full sm:w-[280px] md:w-[320px]">
            <SearchInput
              placeholder="Pesquise por nome"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <span className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar secretaria
            </span>
          </Button>
        </div>
        {/* Lista de secretarias */}
        <SecretariaList
          setSecretarias={setSecretarias}
          secretarias={currentData}
        />
        {/* Paginação */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-sm text-gray-600">
              Linhas por página:
            </span>

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

            <div className="flex gap-2">
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
                <IconChevronRight stroke={2} />
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
      </div>

      {isCreateModalOpen && (
        <SecretariaFormModal
          isOpen={isCreateModalOpen}
          setIsOpen={setIsCreateModalOpen}
          onSuccess={handleSuccess}
        />
      )}
    </LayoutPage>
  );
}
