import { useEffect, useState } from 'react';
import { LayoutPage } from './LayoutPage';
import { getAllServices } from '@/services/servicosServices';
import { toast } from 'sonner';
import type { ServicosListar } from '@/types/ServicosListar';
import { Button } from '@/components/ui/button';
import { ServicesList } from '../components/Servicos/ServicesList';
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
import { getAllServicoExterno } from '@/services/servicosExternosService';
import type { ServicoExterno } from '@/types/servicoExterno';
import { ServicosExternosList } from '@/components/ServicosExternos/ServicosExternosList';

export function ServicesPage() {
  const [cartaDeServicos, setCartaDeServicos] = useState<ServicosListar[]>([]);
  const [servicosExternos, setServicosExternos] = useState<ServicoExterno[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [activeTab, setActiveTab] = useState('servicos');

  async function fetchServices() {
    try {
      setLoading(true);
      const dataCartaDeServico = await getAllServices();
      const dataServicoExterno = await getAllServicoExterno();

      setCartaDeServicos(dataCartaDeServico);
      setServicosExternos(dataServicoExterno);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar os serviços.');
      toast.error(err.message || 'Erro ao buscar os serviços.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServices();
  }, []);

  const filteredCartaDeServicos = cartaDeServicos.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredServicosExternos = servicosExternos.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">Erro: {error}</p>
          <Button onClick={fetchServices} variant="outline" className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando serviços...</p>
      </div>
    );
  }

  const activeList =
    activeTab === 'servicos'
      ? filteredCartaDeServicos
      : filteredServicosExternos;

  const itemsPerPageOptions = [8, 16, 24];

  const totalPages = Math.ceil(activeList.length / itemsPerPage);

  const currentDataCartaDeServicos = filteredCartaDeServicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const currentDataServicosExternos = filteredServicosExternos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <LayoutPage>
      <div className="flex flex-col gap-6 py-8 px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">
            {activeTab === 'servicos'
              ? 'Carta de Serviços'
              : 'Serviços Externos'}
          </h2>
          <p className="text-slate-600 text-xs mt-1">
            Gerencie os serviços disponíveis com clareza e objetividade.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              setCurrentPage(1);
            }}
            className="w-[400px]"
          >
            <TabsList>
              <TabsTrigger value="servicos">Serviços</TabsTrigger>
              <TabsTrigger value="externos">Serviços Externos</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-2">
            <div className="w-[320px]">
              <SearchInput
                placeholder="Pesquise por nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button asChild>
              <Link to="/servicos/novo">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar serviço
              </Link>
            </Button>
          </div>
        </div>

        <ServicesList
          setServicos={setCartaDeServicos}
          servicos={currentDataCartaDeServicos}
        />

        <ServicosExternosList
          setServicos={setServicosExternos}
          servicos={servicosExternos}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Linhas por página:</span>

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
                <IconChevronRight />
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
    </LayoutPage>
  );
}
