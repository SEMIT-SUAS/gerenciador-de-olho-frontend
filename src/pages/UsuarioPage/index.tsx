import { useEffect, useState } from 'react';
import type { UsuarioModel, UsuarioPorId } from '@/types/Usuario';
import type { Secretaria } from '@/types/Secretaria';
import usuarioService from '@/services/usuariosService';
import { secretariaService } from '@/services/secretariaService';
import { toast } from 'sonner';
import { UsuariosList } from '@/pages/UsuarioPage/components/UsuarioList';
import { LayoutPage } from '../../components/LayoutPage';
import { AddUsuarioModal } from './components/AddUsuarioModal';
import { EditUsuarioModal } from './components/EditUsuarioModal';
import { ConfirmModal } from '@/components/Modals/ConfirmModal';
import PageHeader from '@/components/PageHeader';
import { Pagination } from '@/components/Pagination';
import { TableHeaderActions } from '@/components/TableHeaderActions';

export function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<UsuarioModel[]>([]);
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToFetch, setUserToFetch] = useState<UsuarioModel | null>(null);
  const [fetchedUser, setFetchedUser] = useState<UsuarioPorId | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [usuario, setUsuario] = useState<UsuarioModel | null>(null);

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

  const itemsPerPageOptions = [5, 10, 15];

  function handleSearchChange(value: string) {
    setSearchTerm(value);
    setCurrentPage(1);
  }

  return (
    <LayoutPage>
      <div className="flex flex-col gap-4 py-4 px-4 sm:gap-5 sm:py-6 sm:px-6 md:px-8 lg:px-12 xl:px-36">
        <PageHeader
          title="Usuários"
          description="Gerencie todos os usuários do sistema, assegurando cadastros atualizados e acesso controlado às funcionalidades."
        />

        <TableHeaderActions
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          buttonText="Adicionar Usuário"
          onButtonClick={() => setIsFormOpen(true)}
        />

        <UsuariosList
          itemsPerPage={itemsPerPage}
          usuarios={currentUsuarios}
          setUsuarios={setUsuarios}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
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
