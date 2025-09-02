import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import { servicoService } from '@/services/servicosServices';
import { toast } from 'sonner';
import type { ServicosListar } from '@/types/ServicosListar';
import { Button } from '@/components/ui/button';
import { ServicesList } from './components/ServicesList';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchInput } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { servicoExternoService } from '@/services/servicosExternosService';
import type { ServicoExterno } from '@/types/ServicoExterno';
import { ServicosExternosList } from '@/pages/ServicosPage/components/ServicosExternosList';
import { FormServicoExterno } from '@/pages/ServicosPage/components/ServicosExternosForm/ServicoExternoForm';
import PageHeader from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';

export function ServicesPage() {
  const [cartaDeServicos, setCartaDeServicos] = useState<ServicosListar[]>([]);
  const [servicosExternos, setServicosExternos] = useState<ServicoExterno[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('servicos');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  async function getAllServicesData() {
    try {
      // setLoading(true);
      const dataCartaDeServico = await servicoService.getAll();
      const dataServicoExterno = await servicoExternoService.getAll();

      setCartaDeServicos(dataCartaDeServico);
      setServicosExternos(dataServicoExterno);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar os serviços.');
    }
  }

  useEffect(() => {
    getAllServicesData();

    return () => {
      setCartaDeServicos([]);
      setServicosExternos([]);
    };
  }, []);

  const filteredCartaDeServicos = cartaDeServicos?.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredServicosExternos = servicosExternos?.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeList =
    activeTab === 'servicos'
      ? filteredCartaDeServicos
      : filteredServicosExternos;

  const totalPages = Math.ceil((activeList?.length ?? 0) / itemsPerPage);

  const currentDataCartaDeServicos = cartaDeServicos
    ? filteredCartaDeServicos?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ) || []
    : [];

  const currentDataServicosExternos = servicosExternos
    ? filteredServicosExternos?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ) || []
    : [];

  const itemsPerPageOptions = [5, 10, 15, 20];

  return (
    <LayoutPage>
      <div className="flex flex-col gap-6 py-4 px-4 md:py-6 md:px-8 lg:py-8 lg:px-36">
        <PageHeader
          title={
            activeTab === 'servicos' ? 'Carta de Serviços' : 'Servicos Externos'
          }
          description="Gerencie os serviços públicos disponíveis no aplicativo, garantindo
            a clareza e a objetividade das informações para os cidadãos."
        />
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-auto">
            <Tabs
              defaultValue="servicos"
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-auto"
            >
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="servicos" className="flex-1 md:flex-none">
                  Serviços
                </TabsTrigger>
                <TabsTrigger value="externos" className="flex-1 md:flex-none">
                  Serviços Externos
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="w-full sm:w-[280px] md:w-[320px]">
              <SearchInput
                placeholder="Pesquise por nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>

            {activeTab === 'servicos' ? (
              <Button asChild className="w-full sm:w-auto">
                <Link to={'/servicos/novo'}>
                  <span className="flex items-center justify-center">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Adicionar serviço</span>
                    <span className="sm:hidden">Adicionar</span>
                  </span>
                </Link>
              </Button>
            ) : (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center justify-center">
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Adicionar serviço</span>
                  <span className="sm:hidden">Adicionar</span>
                </span>
              </Button>
            )}
          </div>
        </div>

        <div className="w-full">
          {activeTab === 'servicos' ? (
            <ServicesList
              itemsPerPage={itemsPerPage}
              setServicos={setCartaDeServicos}
              servicos={currentDataCartaDeServicos}
            />
          ) : (
            <ServicosExternosList
              itemsPerPage={itemsPerPage}
              setServicos={setServicosExternos}
              servicos={currentDataServicosExternos}
            />
          )}
        </div>

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
        <FormServicoExterno
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async () => {
            setIsCreateModalOpen(false);
            await getAllServicesData();
          }}
        />
      )}
    </LayoutPage>
  );
}
