import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAll } from '@/services/secretariaService';
import { getAllCategorias } from '@/services/servicocategoriaService';
import { getAllPerosona } from '@/services/servicoPersona';
import { getServicoById, updateServico } from '@/services/servicosServices';
import type {
  ServicoFormInput,
  ServicoFormOutput,
} from '../../components/Forms/ServiceForm/servicoSchema';

import type { SecretariaModel } from '@/types/Secretaria';
import type { Persona } from '@/types/Persona';
import type { ServicoCategoria } from '@/types/CategoriaServico';

import { ServicoForm } from '@/components/Forms/ServiceForm/ServiceForm';

function ServicoEditarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [secretarias, setSecretarias] = useState<SecretariaModel[]>([]);
  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  const [servicoParaEditar, setServicoParaEditar] =
    useState<ServicoFormInput | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDadosParaEdicao() {
      if (!id) {
        console.error('ID não encontrado na URL');
        setIsLoading(false);
        return;
      }

      try {
        const [secretariasData, categoriasData, personaData, servicoData] =
          await Promise.all([
            getAll(),
            getAllCategorias(),
            getAllPerosona(),
            getServicoById(Number(id)),
          ]);

        setSecretarias(secretariasData);
        setCategorias(categoriasData);
        setPersonas(personaData);

        const dadosFormatadosParaForm: ServicoFormInput = {
          nome: servicoData.nome,
          descricao: servicoData.descricao,
          publicoDestinado: (servicoData.publicoDestinado ?? []).filter(
            (p: string): p is 'Pessoa Física' | 'Pessoa Jurídica' =>
              p === 'Pessoa Física' || p === 'Pessoa Jurídica',
          ),
          formasSolicitacao: (servicoData.formasSolicitacao ?? []).filter(
            (f: string): f is 'Presencial' | 'Online' | 'Telefone' =>
              f === 'Presencial' || f === 'Online' || f === 'Telefone',
          ),
          documentacaoNecessaria: servicoData.documentacaoNecessaria,
          custos: servicoData.custos,
          etapas: servicoData.etapas,
          requisitos: servicoData.requisitos,
          secretariaId: servicoData.orgao?.id ?? 0,
          categoriaId: servicoData.categoria?.id ?? 0,
          personaIds: servicoData.personas?.map((p) => p.id) ?? [],
          visivel: servicoData.visivel,
          ativo: servicoData.ativo,
        };
        setServicoParaEditar(dadosFormatadosParaForm);
      } catch (err) {
        console.error('Erro ao buscar dados para edição:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDadosParaEdicao();
  }, [id]);

  async function handleFormSubmit(data: ServicoFormOutput) {
    if (!id) return;

    setIsSubmitting(true);

    const payload = {
      ...data,
      orgao: data.secretariaId,
      categoria: data.categoriaId,
    };

    try {
      await updateServico(Number(id), payload as any);
      navigate(`/servicos/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar o serviço:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        Carregando dados para edição...
      </div>
    );
  }

  if (!servicoParaEditar) {
    return (
      <div className="container mx-auto py-10">
        Serviço não encontrado ou erro ao carregar.
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        Editar Serviço: {servicoParaEditar.nome}
      </h1>
      <ServicoForm
        secretarias={secretarias}
        categorias={categorias}
        personas={personas}
        onSubmit={handleFormSubmit}
        isLoading={isSubmitting}
        defaultValues={servicoParaEditar}
      />
    </div>
  );
}

export default ServicoEditarPage;
