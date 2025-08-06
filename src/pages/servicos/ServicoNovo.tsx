// Exemplo de uso em uma página
import { getAll } from '@/services/secretariaService';
import { ServicoForm } from '../../components/Forms/ServiceForm/ServicoForm';
import { type ServicoFormOutput } from '../../components/Forms/ServiceForm/servicoSchema';
import { useState, useEffect } from 'react';
import { getAllCategorias } from '@/services/servicocategoriaService';
import { getAllPerosona } from '@/services/servicoPersona';
import type { SecretariaModel } from '@/types/Secretaria';
import type { Persona } from '@/types/Persona';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { createService } from '@/services/servicosServices';
import { useNavigate } from 'react-router-dom';
import { LayoutPage } from '@/pages/LayoutPage';

function ServicoNovo() {
  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);
  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDados() {
      try {
        const [secretariasData, categoriasData, personaData] =
          await Promise.all([getAll(), getAllCategorias(), getAllPerosona()]);
        setSecretarias(secretariasData);
        setCategorias(categoriasData);
        setPersonas(personaData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    }
    fetchDados();
  }, []);

  async function handleFormSubmit(data: ServicoFormOutput) {
    setIsLoading(true);
    const payload = {
      ...data,
      orgao: data.secretariaId,
      categoria: data.categoriaId,
      personas: data.personaIds,
    };

    try {
      await createService(payload as any);
      navigate('/servicos');
    } catch (err: any) {}
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  }

  return (
    <LayoutPage>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className=" text-center text-2xl font-bold text-gray-900 mb-2">
            Adicionar novo serviço
          </h1>
          <p className="text-gray-600 text-center">
            Gerencie com precisão todos os serviços que a prefeitura oferece.
            Tenha controle total para adicionar, visualizar, editar e remover
            cada item, garantindo informações sempre atualizadas e acessíveis.
          </p>
        </div>
        <ServicoForm
          secretarias={secretarias}
          categorias={categorias}
          personas={personas}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </div>
    </LayoutPage>
  );
}

export default ServicoNovo;
