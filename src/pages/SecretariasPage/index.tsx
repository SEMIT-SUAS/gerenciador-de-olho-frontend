import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { Secretaria } from '../../types/Secretaria';
import { secretariaService } from '../../services/secretariaService';
import { SecretariaList } from './components/SecretariaList';
import { SecretariaFormModal } from './components/SecretariaModalForm';
import { LayoutPage } from '@/components/LayoutPage';
import PageHeader from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { TableHeaderActions } from '@/components/TableHeaderActions';

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
      const data = await secretariaService.getAll();
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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <PageHeader
          title="Secretarias"
          description="Gerencie todas as secretarias da prefeitura de forma centralizada, garantindo informações sempre atualizadas e acessíveis."
        />
        <TableHeaderActions
          searchValue={searchTerm}
          onSearchChange={handleSearch}
          buttonText="Adicionar Secretaria"
          onButtonClick={() => setIsCreateModalOpen(true)}
        />
        <SecretariaList
          setSecretarias={setSecretarias}
          secretarias={currentData}
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
