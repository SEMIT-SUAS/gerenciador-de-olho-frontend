import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/ui/input';
import { LayoutPage } from './../LayoutPage';
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconEdit,
  IconEye,
  IconTrash,
} from '@tabler/icons-react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ServicoVisibility } from '@/components/Forms/ServicoForm/ServicoVisibility';

import servicosServices, { getAllServices } from '@/services/servicosServices';
import type { ServicosListar } from '@/types/ServicosListar';
import { Badge } from '@/components/ui/badge';
import { ServicesListItem } from './ServicesListItem';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ServicesList() {
  const navigate = useNavigate();

  const [services, setServices] = useState<ServicosListar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  async function fetchServices() {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
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

  const filtered = services.filter((s) =>
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const itemsPerPageOptions = [8, 16, 24];

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentData = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando serviços...</p>
      </div>
    );
  }

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

  return (
    <LayoutPage>
      <div className="flex flex-col gap-6 py-8 px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Serviços</h2>
          <p className="text-slate-600 text-xs mt-1">
            Gerencie os serviços disponíveis com clareza e objetividade.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="account" className="w-[400px]">
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

        <Table className="rounded-md overflow-hidden border-2 border-gray-500 shadow-lg">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Persona</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentData.map((service) => (
              <ServicesListItem
                key={service.id}
                servico={service}
                setServicos={setServices}
              />
            ))}
          </TableBody>
        </Table>

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
