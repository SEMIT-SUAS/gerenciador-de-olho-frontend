import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import { espacoPublicoService } from '@/services/espacoPublicoService';
import { EspacosPublicosList } from '@/pages/EspacosPublicosPage/components/EspacosPublicosList';
import { useNavigate } from 'react-router-dom';
import { TableHeaderActions } from '@/components/TableHeaderActions';
import { Pagination } from '@/components/Pagination';
import PageHeader from '@/components/PageHeader';

export function EspacosPublicosPage() {
  const navigate = useNavigate();
  const [espacosPublicos, setEspacosPublicos] = useState<EspacoPublicoModel[]>(
    [],
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    espacoPublicoService.getAll().then((data) => {
      setEspacosPublicos(data);
    });
  }, []);

  const filteredEspacos = espacosPublicos?.filter((espaco) =>
    espaco.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil((filteredEspacos?.length ?? 0) / itemsPerPage);
  const currentEspacos =
    filteredEspacos?.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage,
    ) || [];

  const itemsPerPageOptions = [5, 10, 15, 20];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    navigate('/espacos-publicos/add');
  };

  return (
    <>
      <LayoutPage>
        <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
          <PageHeader
            title="Espaços públicos"
            description="Gerencie os espaços públicos destinados aos serviços da prefeitura, assegurando registros precisos, atualizados e de fácil acesso."
          />
          <TableHeaderActions
            searchValue={searchTerm}
            onSearchChange={handleSearch}
            buttonText="Adicionar espaço público"
            onButtonClick={handleAddNew}
          />

          <EspacosPublicosList
            espacosPublicos={currentEspacos}
            itensPerPage={itemsPerPage}
            setEspacosPublicos={setEspacosPublicos}
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
    </>
  );
}
