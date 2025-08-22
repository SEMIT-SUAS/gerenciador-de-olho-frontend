import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getAllCategorias } from '@/services/servicocategoriaService';
import { getAllPersona } from '@/services/servicoPersona';
import { getServicoById, updateServico } from '@/services/servicosServices';
import type {
  ServicoFormInput,
  ServicoFormOutput,
} from './ServicoForm/servicoSchema';

import type { Secretaria } from '@/types/Secretaria';
import type { Persona } from '@/types/Persona';
import type { ServicoCategoria } from '@/types/CategoriaServico';
import { LayoutPage } from '@/components/LayoutPage';

import { ServicoForm } from '@/pages/ServicosPage/components/ServicoForm/ServicoForm';
import { getAllSecretarias } from '@/services/secretariaService';
import { toast } from 'react-toastify';

function ServicoEditarPage() {
  const navigate = useNavigate();
  const { id: servicoId } = useParams<{ id: string }>();

  const [secretarias, setSecretarias] = useState<Secretaria[]>([]);
  const [categorias, setCategorias] = useState<ServicoCategoria[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);

  const [servicoParaEditar, setServicoParaEditar] =
    useState<ServicoFormInput | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchDadosParaEdicao() {
      if (!servicoId) {
        console.error('ID não encontrado na URL');
        setIsLoading(false);
        return;
      }

      try {
        const [secretariasData, categoriasData, personaData, servicoData] =
          await Promise.all([
            getAllSecretarias(),
            getAllCategorias(),
            getAllPersona(),
            getServicoById(Number(servicoId)),
          ]);

        setSecretarias(secretariasData);
        setCategorias(categoriasData);
        setPersonas(personaData);

        const dadosFormatadosParaForm: ServicoFormInput = {
          nome: servicoData.nome,
          descricao: servicoData.descricao,
          publicoDestinado: servicoData.publicoDestinado
            .split(',')
            .map((publico) => publico.trim())
            .filter(
              (publico): publico is 'Pessoa Física' | 'Pessoa Jurídica' =>
                publico === 'Pessoa Física' || publico === 'Pessoa Jurídica',
            ),

          formasSolicitacao: servicoData.formasSolicitacao
            .split(',')
            .map((item) => item.trim())
            .filter(
              (item): item is 'Presencial' | 'Online' | 'Telefone' =>
                item === 'Presencial' ||
                item === 'Online' ||
                item === 'Telefone',
            ),

          documentacaoNecessaria: servicoData.documentacaoNecessaria
            .split(',')
            .map((s) => s.trim()),

          prazoAtendimento: servicoData.prazoAtendimento,
          horarioAtendimento: servicoData.horarioAtendimento,
          setorLotacao: servicoData.setorLotacao,
          prioridades: servicoData.prioridades,
          formasAcompanhamento: servicoData.formasAcompanhamento,
          legislacao: servicoData.legislacao,
          modeloRequerimento: servicoData.modeloRequerimento,
          custos: servicoData.custos,
          etapas: servicoData.etapas,
          requisitos: servicoData.requisitos,
          secretariaId: servicoData.orgao?.id ?? 0,
          categoriaId: servicoData.categoria?.id ?? 0,

          personaIds: (servicoData.personas ?? [])
            .map((p) => p.id)
            .filter((id) => id != null),

          visivel: servicoData.visivel,
          ativo: servicoData.ativo,
        };
        setServicoParaEditar(dadosFormatadosParaForm);
      } catch (err) {
        console.error('Erro ao buscar dados para edição:', err);
        toast.error('Erro ao buscar dados para edição do serviço.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDadosParaEdicao();
  }, [servicoId]);

  async function handleFormSubmit(data: ServicoFormOutput) {
    if (!servicoId) return;

    setIsSubmitting(true);

    const payload = {
      ...data,
      id: Number(servicoId),
      orgao: data.secretariaId,
      categoria: data.categoriaId,
      personas: data.personaIds,
    };

    console.log('Payload enviado:', JSON.stringify(payload, null, 2));

    try {
      await updateServico(payload);
      navigate(`/servicos/${servicoId}`);
    } catch (err: any) {
      console.error('Erro ao atualizar o serviço:', err);
      toast.error(
        'Erro ao atualizar o serviço: ' +
          (err instanceof Error ? err.message : ''),
      );
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
    <LayoutPage>
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-center text-2xl font-bold text-gray-900 mb-2">
            Editar serviço
          </h1>
          <p className="text-gray-600  text-center">
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
          isLoading={isSubmitting}
          defaultValues={servicoParaEditar}
        />
      </div>
    </LayoutPage>
  );
}

export default ServicoEditarPage;
