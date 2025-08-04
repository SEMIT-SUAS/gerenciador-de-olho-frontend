// Exemplo de uso em uma página
import { getAll } from '@/services/secretariaService';
import { ServicoForm } from '../../components/Forms/AddServicoForm/ServicoForm';
import { type ServicoFormOutput } from '../../components/Forms/AddServicoForm/servicoSchema';
import { useState, useEffect } from 'react';
import { getAllCategorias } from '@/services/servicocategoriaService';
import { getAllPerosona } from '@/services/servicoPersona';
import type { SecretariaModel } from '@/types/Secretaria';
import type { Persona } from '@/types/Persona';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { createService } from '@/services/servicosServices';
import { useNavigate } from 'react-router-dom';

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
      personas: data.personaIds.map((id) => ({ id })),
    };

    try {
      await createService(payload as any);
      navigate('/servicos');
    } catch (err: any) {}
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Serviço</h1>
      <ServicoForm
        secretarias={secretarias}
        categorias={categorias}
        personas={personas}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}

export default ServicoNovo;
