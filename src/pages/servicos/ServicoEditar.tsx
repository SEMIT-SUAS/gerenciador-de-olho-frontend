import  { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { Services } from '../../types/Services';
import { getServicoById, updateServico } from '../../services/servicosServices';

export function ServicoEditar() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<Services>();
  
  const publicoDestinado = watch('publicoDestinado') as string[] | undefined;
  const formasSolicitacao = watch('formasSolicitacao') as string[] | undefined;
  const documentacaoNecessaria = watch('documentacaoNecessaria') as string[] | undefined;

  useEffect(() => {
    async function fetchServico() {
      try {
        if (!id) return;
        
        const servico = await getServicoById(Number(id));
        
        // popula o formulário com reset
        reset(servico);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar serviço');
      } finally {
        setLoading(false);
      }
    }

    fetchServico();
  }, [id, reset]);

  const onSubmit = async (data: Services) => {
    try {
      await updateServico(data);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar');
    }
  };

  // Helper para campos de array
  const handleArrayField = (
    fieldName: 'publicoDestinado' | 'formasSolicitacao' | 'documentacaoNecessaria',
    value: string
  ) => {
    const arrayValue = value.split('\n').filter(item => item.trim());
    setValue(fieldName, arrayValue);
  };

  if (loading) return <p>Carregando dados do serviço...</p>;
  if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

  return (
    <div style={{ maxWidth: 800, margin: 'auto' }}>
      <h2>Editar Serviço</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Nome:
          <input
            type="text"
            {...register('nome', { required: 'Nome é obrigatório' })}
          />
          {errors.nome && <span style={{ color: 'red' }}>{errors.nome.message}</span>}
        </label>

        <label>
          Descrição:
          <textarea
            {...register('descricao', { required: 'Descrição é obrigatória' })}
            rows={3}
          />
          {errors.descricao && <span style={{ color: 'red' }}>{errors.descricao.message}</span>}
        </label>

        <label>
          Público Destinado (um por linha):
          <textarea
            value={publicoDestinado?.join('\n') || ''}
            onChange={(e) => handleArrayField('publicoDestinado', e.target.value)}
            rows={3}
          />
        </label>

        <label>
          Formas de Solicitação (uma por linha):
          <textarea
            value={formasSolicitacao?.join('\n') || ''}
            onChange={(e) => handleArrayField('formasSolicitacao', e.target.value)}
            rows={3}
          />
        </label>

        <label>
          Documentação Necessária (uma por linha):
          <textarea
            value={documentacaoNecessaria?.join('\n') || ''}
            onChange={(e) => handleArrayField('documentacaoNecessaria', e.target.value)}
            rows={3}
          />
        </label>

        <label>
          Custos:
          <input
            type="text"
            {...register('custos')}
          />
        </label>

        <label>
          Etapas:
          <textarea
            {...register('etapas')}
            rows={2}
          />
        </label>

        <label>
          Requisitos:
          <textarea
            {...register('requisitos')}
            rows={2}
          />
        </label>

        <label>
          Formas de Acompanhamento:
          <textarea
            {...register('formasAcompanhamento')}
            rows={2}
          />
        </label>

        <label>
          Prazo de Atendimento:
          <input
            type="text"
            {...register('prazoAtendimento')}
          />
        </label>

        <label>
          Prioridades:
          <textarea
            {...register('prioridades')}
            rows={2}
          />
        </label>

        <label>
          Horário de Atendimento:
          <input
            type="text"
            {...register('horarioAtendimento')}
          />
        </label>

        <label>
          Legislação:
          <textarea
            {...register('legislacao')}
            rows={2}
          />
        </label>

        <label>
          Órgão:
          <input
            type="text"
            {...register('orgao')}
          />
        </label>

        <label>
          Categoria:
          <input
            type="text"
            {...register('categoria.nome')}
          />
        </label>

        <label>
          Setor de Lotação:
          <input
            type="text"
            {...register('setorLotacao')}
          />
        </label>

        <label>
          Modelo de Requerimento:
          <input
            type="text"
            {...register('modeloRequerimento')}
          />
        </label>

        <label>
          Visível:
          <input
            type="checkbox"
            {...register('visivel')}
          />
        </label>

        <label>
          Ativo:
          <input
            type="checkbox"
            {...register('ativo')}
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}