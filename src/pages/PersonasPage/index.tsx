import { useEffect, useState } from 'react';
import { LayoutPage } from '../../components/LayoutPage';
import { personaService } from '@/services/personaService';
import { toast } from 'sonner';
import type { Persona } from '@/types/Persona';
import { Button } from '@/components/ui/button';
import { PersonasList } from './components/PersonaList';
import { SearchInput } from '@/components/ui/input';
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
import { FormPersona } from './components/PersonasForms';

export function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);

  async function fetchPersonas() {
    try {
      setLoading(true);
      const data = await personaService.getAll();
      setPersonas(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao buscar as personas.');
      toast.error(err.message || 'Erro ao buscar as personas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPersonas();
  }, []);

  const filteredPersonas = personas.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  function handleEdit(persona: Persona) {
    setSelectedPersona(persona);
    setIsEditModalOpen(true);
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600">Erro: {error}</p>
          <Button onClick={fetchPersonas} variant="outline" className="mt-4">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Carregando personas...</p>
      </div>
    );
  }

  const itemsPerPageOptions = [8, 16, 24];

  const totalPages = Math.ceil(filteredPersonas.length / itemsPerPage);

  const currentData = filteredPersonas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Personas</h2>
          <p className="text-slate-600 text-xs sm:text-xs mt-1">
            Gerencie com precisão todas as Personas para serviços da prefeitura.
            Tenha controle total para adicionar, visualizar, editar e remover
            cada órgão, garantindo informações sempre atualizadas e acessíveis.
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
            <Plus className="mr-2 h-4 w-4" />
            Adicionar persona
          </Button>
        </div>

        <PersonasList
          personas={currentData}
          setPersonas={setPersonas}
          onEdit={handleEdit}
        />

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

      {/* Modal de Criar */}
      {isCreateModalOpen && (
        <FormPersona
          mode="create"
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={async () => {
            setIsCreateModalOpen(false);
            await fetchPersonas();
          }}
        />
      )}

      {/* Modal de Editar */}
      {isEditModalOpen && selectedPersona && (
        <FormPersona
          mode="edit"
          defaultValues={selectedPersona}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPersona(null);
          }}
          onSuccess={async () => {
            setIsEditModalOpen(false);
            setSelectedPersona(null);
            await fetchPersonas();
          }}
        />
      )}
    </LayoutPage>
  );
}
