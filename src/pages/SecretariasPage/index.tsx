import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import type { Secretaria } from '../../types/Secretaria';
import {
  deleteSecretaria,
  getAllSecretarias,
  updateSecretaria,
} from '../../services/secretariaService';
import { getSecretariaById } from '../../services/secretariaService';
// import {deleteSecretaria} from '../../services/secretariaService';
// import {updateSecretaria} from '../../services/secretariaService';
import { SecretariaList } from './components/SecretariaList';
import { SecretariaFormModal } from './components/SecretariaModalForm';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function SecretariaPage() {
  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    carregarSecretarias();
  }, []);

  async function carregarSecretarias() {
    try {
      const lista = await getAllSecretarias();
      setSecretarias(lista);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  //funções sem consumo de enpoint:
  async function handleView(id: string | number) {
    try {
      const secretaria = await getSecretariaById(Number(id));
      return secretaria;
    } catch (error) {}
  }

  async function handleDelete(id: string | number) {
    try {
      const secretaria = await deleteSecretaria(Number(id));
      return secretaria;
    } catch (error) {}
  }

  async function handleUpdate(id: string | number) {
    try {
      const secretaria = await updateSecretaria(Number(id));
      return secretaria;
    } catch (error) {}
  }

  const handleSucessoCadastro = () => {
    setModalAberto(false);
    carregarSecretarias();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Conteúdo principal */}
      <div className="mx-auto px-6 py-8">
        {/* Cabeçalho da página */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Secretarias</h1>
          <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
            Gerencie com precisão todas as Secretarias da prefeitura. Tenha
            controle total para adicionar, visualizar, editar e remover cada
            órgão, garantindo informações sempre atualizadas e acessíveis.
          </p>
        </div>

        {/* Barra de ações */}
        <div className="flex items-center gap-4 mb-6">
          <SearchInput
            value={searchValue}
            // onChange={setSearchValue}
            placeholder="Pesquise um serviço"
            className="flex-1"
          />
          {/* <Button
            label=""
            isAdding={modalAberto}
            onClick={() => setModalAberto(!modalAberto)}
          /> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Cabeçalho da tabela */}
          <div className="grid grid-cols-16 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="col-span-4 text-left">
              <span className="text-sm font-medium text-gray-700">Nome</span>
            </div>
            <div className="col-span-4 text-left">
              <span className="text-sm font-medium text-gray-700">Sigla</span>
            </div>
            <div className="col-span-4 text-left">
              <span className="text-sm font-medium text-gray-700">Estado</span>
            </div>
            <div className="col-span-4 text-left">
              <span className="text-sm font-medium text-gray-700">Ações</span>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            <SecretariaList
              secretarias={secretarias}
              onEdit={handleUpdate}
              onView={handleView}
              onDelete={handleDelete}
            />
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Linhas por página:</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Página 1 de 7</span>
              <div className="flex items-center space-x-1">
                {/* Botões de navegação da paginação (ainda estáticos)*/}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled
                >
                  <span className="sr-only">Primeira página</span>
                  {'<<'}
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled
                >
                  <span className="sr-only">Página anterior</span>
                  {'<'}
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <span className="sr-only">Próxima página</span>
                  {'>'}
                </button>
                <button className="p-2 text-gray-600 hover:text-gray-800">
                  <span className="sr-only">Última página</span>
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cadastro - mantém a funcionalidade original */}
      {modalAberto && (
        <SecretariaFormModal
          onClose={() => setModalAberto(false)}
          onSuccess={handleSucessoCadastro}
        />
      )}
    </div>
  );
}
