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
import { servicoExternoService } from '@/services/servicosExternosService';
import type { ServicoExterno } from '@/types/ServicoExterno';
import { ServicosExternosList } from '@/pages/ServicosPage/components/ServicosExternosList';
import { FormServicoExterno } from '@/pages/ServicosPage/components/ServicosExternosForm/ServicoExternoForm';

export function ServicesPage() {
  const [cartaDeServicos, setCartaDeServicos] = useState<
    ServicosListar[] | null
  >(null);
  const [servicosExternos, setServicosExternos] = useState<
    ServicoExterno[] | null
  >(null);
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
      setCartaDeServicos(null);
      setServicosExternos(null);
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

  const itemsPerPageOptions = [8, 16, 24];

  return (
    <LayoutPage>
      <div className="flex flex-col gap-6 py-4 px-4 md:py-6 md:px-8 lg:py-8 lg:px-36">
        <div className="w-full max-w-full lg:max-w-[640px]">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
            {activeTab === 'servicos'
              ? 'Carta de Serviços'
              : 'Serviços Externos'}
          </h2>
          <p className="text-slate-600 text-xs md:text-sm mt-1">
            Gerencie os serviços disponíveis com clareza e objetividade.
          </p>
        </div>

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
                className="p-2"
              >
                <IconChevronsLeft stroke={2} className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2"
              >
                <IconChevronLeft stroke={2} className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2"
              >
                <IconChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="p-2"
              >
                <IconChevronsRight stroke={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
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
