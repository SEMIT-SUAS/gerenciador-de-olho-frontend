import { useEffect, useState } from 'react';
import { LayoutPage } from '../LayoutPage';
import type { EspacoPublicoModel } from '@/types/EspacoPublico';
import espaçoPublicoService from '@/services/espacoPublicoService';
import { EspacosPublicosList } from '@/components/EspacosPublicos/EspacosPublicosList';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

export function EspacosPublicosPage() {
  const navigate = useNavigate();
  const [espacosPublicos, setEspacosPublicos] = useState<
    EspacoPublicoModel[] | null
  >(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    espaçoPublicoService.getAll().then((data) => {
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

  return (
    <>
      <LayoutPage additionalStyles="px-[39px]">
        <div className="flex flex-col gap-6 py-8 px-36">
          <div className="w-[50%]">
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
              Espaços públicos
            </h3>

            <p className="text-slate-600 text-xs">
              Gerencie com precisão todos os espaços públicos para serviços da
              prefeitura. Tenha controle total para adicionar, visualizar,
              editar e remover cada espaço, garantindo informações sempre
              atualizadas e acessíveis.
            </p>
          </div>

          <div className="flex items-center justify-end gap-4">
            <div className="relative w-[320px]">
              <SearchInput
                placeholder="Pesquise pelo nome"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Button
              className="flex items-center gap-2"
              onClick={() => navigate('/espacos-publicos/add')}
            >
              <PlusIcon className="h-4 w-4" />
              Adicionar espaço público
            </Button>
          </div>

          <EspacosPublicosList
            espacosPublicos={currentEspacos}
            itensPerPage={itemsPerPage}
            setEspacosPublicos={setEspacosPublicos}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Itens por página:</span>

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
      </LayoutPage>
    </>
  );
}
