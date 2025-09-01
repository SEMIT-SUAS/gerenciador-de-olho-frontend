import { useEffect, useState } from 'react';
import type { UsuarioModel, UsuarioPorId } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import usuarioService from '@/services/usuariosService';
import { secretariaService } from '@/services/secretariaService';
import { toast } from 'sonner';

import { UsuariosList } from '@/pages/UsuarioPage/components/UsuarioList';
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
import { AddUsuarioModal } from './components/AddUsuarioModal';
import { EditUsuarioModal } from './components/EditUsuarioModal';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import { useCallback } from 'react';

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToFetch, setUserToFetch] = useState<UsuarioModel | null>(null);
  const [fetchedUser, setFetchedUser] = useState<UsuarioPorId | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);
  // const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (usuario: UsuarioModel) => {
    setIsEditModalOpen(true);
    setUserToFetch(usuario);
  };

  async function handleDelete() {
    if (!usuario) return;

    try {
      await usuarioService.excluirUsuario(usuario.id);
      setUsuarios((prev) => {
        if (!prev) return prev;
        return prev.filter((u) => u.id !== usuario.id);
      });
      toast.success('Usuário excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir usuário.');
    } finally {
      setIsDeleteModalOpen(false);
      setUsuario(null);
    }
  }

  useEffect(() => {
    if (userToFetch) {
      const fetchUserData = async () => {
        // setIsLoading(true);
        try {
          const fetchedData = await usuarioService.buscarUsuarioPorId(
            userToFetch.id,
          );
          setFetchedUser(fetchedData);
        } catch (error) {
          toast.error('Falha ao carregar os dados do usuário para edição.');
          setIsEditModalOpen(false);
          setFetchedUser(null);
        } finally {
          // setIsLoading(false);
        }
      };

      fetchUserData();
    }
  }, [userToFetch]);

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setUserToFetch(null);
    setFetchedUser(null);
  };

  const handleDeleteClick = (usuario: UsuarioModel) => {
    setUsuario(usuario);
    setIsDeleteModalOpen(true);
  };

  async function getAllUsuariosData() {
    try {
      const [usuariosData, secretariasData] = await Promise.all([
        usuarioService.getAllUsuarios(),
        secretariaService.getAll(),
      ]);

      setSecretarias(secretariasData);
      return usuariosData;
    } catch (error: any) {
      toast.error(error.message || 'Erro ao buscar os dados.');
    }
  }

  useEffect(() => {
    getAllUsuariosData().then((usuariosData) => {
      if (usuariosData) {
        setUsuarios(usuariosData);
      }
    });

    return () => {
      setUsuarios([]);
    };
  }, []);

  const reloadUsuarios = useCallback(async () => {
    try {
      const data = await usuarioService.getAllUsuarios();
      if (data) setUsuarios(data);
    } catch (e) {
      toast.error('Erro ao recarregar usuários.');
    }
  }, []);

  const filteredUsuarios = usuarios?.filter((usuario) => {
    const secretaria = secretarias.find((s) => s.id === usuario.idSecretaria);
    const secretariaNome = secretaria?.nome.toLowerCase() || '';
    const secretariaSigla = secretaria?.sigla.toLowerCase() || '';

    return (
      usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secretariaNome.includes(searchTerm.toLowerCase()) ||
      secretariaSigla.includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil((filteredUsuarios?.length ?? 0) / itemsPerPage);

  const currentUsuarios = usuarios
    ? filteredUsuarios?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
      ) || []
    : [];

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handleItemsPerPageChange(value: string) {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  }

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <div className="max-w-[640px]">
          <h2 className="text-3xl font-bold tracking-tight">Usuários</h2>
          <p className="text-slate-600 text-xs sm:text-xs mt-1">
            Gerencie os usuários cadastrados na plataforma.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-2">
          <div className="w-full sm:w-[280px] md:w-[320px]">
            <SearchInput
              placeholder="Pesquise por nome ou secretaria"
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
              Adicionar Usuário
            </Button>
          </div>
        </div>

        <UsuariosList
          itemsPerPage={itemsPerPage}
          usuarios={currentUsuarios}
          setUsuarios={setUsuarios}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-sm text-gray-600">
              Linhas por página:
            </span>
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
                className="hidden sm:inline-flex"
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
                className="hidden sm:inline-flex"
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

      <AddUsuarioModal
        onOpenChange={() => setIsFormOpen(!isFormOpen)}
        open={isFormOpen}
        setUsuarios={setUsuarios}
        secretarias={secretarias}
      />

      {isEditModalOpen && fetchedUser && (
        <EditUsuarioModal
          open={isEditModalOpen}
          onOpenChange={handleCloseEditModal}
          secretarias={secretarias}
          usuario={fetchedUser}
          onUserUpdated={reloadUsuarios}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário "${
          usuario?.nome ?? ''
        }"? Esta ação não pode ser desfeita.`}
      />
    </LayoutPage>
  );
}
