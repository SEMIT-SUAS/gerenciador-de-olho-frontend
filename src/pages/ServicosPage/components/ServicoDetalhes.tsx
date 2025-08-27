// src/components/servicos/ServicoDetalhe.tsx
'use client';

import type { Servicos } from '@/types/Servicos'; // Ajuste o caminho para sua interface
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Building2,
  Tag,
  Users,
  Clock,
  DollarSign,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { servicoService } from '@/services/servicosServices';
import { LayoutPage } from '../../../components/LayoutPage';

const DetailSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold border-b pb-2">{title}</h2>
    <div className="text-muted-foreground text-base leading-relaxed">
      {children}
    </div>
  </section>
);

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start space-x-3">
    <Icon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
    <div>
      <p className="text-sm font-semibold text-card-foreground">{label}</p>
      <div className="text-sm text-muted-foreground">{value}</div>
    </div>
  </div>
);

export function ServicoDetalhes() {
  const { id } = useParams<{ id: string }>();
  const [servico, setServico] = useState<Servicos | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchService() {
      if (!id) {
        setError('ID do serviço não fornecido na URL.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const servicoData = await servicoService.getById(Number(id));
        setServico(servicoData);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar o serviço.');
      } finally {
        setLoading(false);
      }
    }
    fetchService();
  }, [id]);

  if (loading) {
    return (
      <div className="container p-10">Carregando detalhes do serviço...</div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  if (!servico) {
    return (
      <div className="container p-10">
        <Card className="p-8 text-center">
          <CardTitle>Serviço não encontrado</CardTitle>
        </Card>
      </div>
    );
  }

  const {
    nome,
    descricao,
    orgao,
    categoria,
    publicoDestinado,
    formasSolicitacao,
    documentacaoNecessaria,
    custos,
    etapas,
    requisitos,
    prazoAtendimento,
    horarioAtendimento,
    personas,
    visivel,
    ativo,
  } = servico;

  return (
    <LayoutPage>
      <div className="container mx-auto max-w-7xl py-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <main className="lg:col-span-2 space-y-10">
            <header className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-primary">
                {nome}
              </h1>
              {orgao && (
                <p className="text-xl text-muted-foreground">
                  Oferecido por: {orgao.nome}
                </p>
              )}
            </header>

            <DetailSection title="Descrição do Serviço">
              <p>{descricao}</p>
            </DetailSection>

            <DetailSection title="Como Solicitar">
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-card-foreground">
                  Formas de Solicitação:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {formasSolicitacao.split(',').map((forma) => (
                    <Badge key={forma}>{forma}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-card-foreground">
                  Horário de Atendimento:
                </h3>
                <p>{horarioAtendimento || 'Não informado'}</p>
              </div>
            </DetailSection>

            <DetailSection title="Requisitos e Documentos">
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-card-foreground">
                  Quem pode solicitar?
                </h3>
                <div className="flex flex-wrap gap-2">
                  {publicoDestinado.split(',').map((publico) => (
                    <Badge variant="secondary" key={publico}>
                      {publico}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-card-foreground">
                  Requisitos:
                </h3>
                <p>{requisitos || 'Não informado'}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-card-foreground">
                  Documentação Necessária:
                </h3>
                {documentacaoNecessaria.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {documentacaoNecessaria.split(',').map((doc, i) => (
                      <li key={i}>{doc}</li>
                    ))}
                  </ul>
                ) : (
                  'Nenhuma documentação específica informada.'
                )}
              </div>
            </DetailSection>

            <DetailSection title="Etapas, Custos e Prazos">
              <div className="space-y-2 mb-4">
                <h3 className="font-semibold text-card-foreground">
                  Etapas do Processo:
                </h3>
                <p>{etapas || 'Não informado'}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  icon={DollarSign}
                  label="Custos"
                  value={custos || 'Não informado'}
                />
                <InfoItem
                  icon={Clock}
                  label="Prazo de Atendimento"
                  value={prazoAtendimento || 'Não informado'}
                />
              </div>
            </DetailSection>
          </main>

          <aside className="lg:col-span-1 space-y-6 lg:mt-20">
            <Card>
              <CardHeader>
                <CardTitle>Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {orgao && (
                  <InfoItem
                    icon={Building2}
                    label="Órgão Responsável"
                    value={orgao.nome}
                  />
                )}
                {categoria && (
                  <InfoItem
                    icon={Tag}
                    label="Categoria"
                    value={categoria.nome}
                  />
                )}

                <InfoItem
                  icon={visivel ? CheckCircle2 : XCircle}
                  label="Status no Portal"
                  value={
                    <Badge variant={visivel ? 'default' : 'destructive'}>
                      {visivel ? 'Visível' : 'Oculto'}
                    </Badge>
                  }
                />
                <InfoItem
                  icon={ativo ? CheckCircle2 : XCircle}
                  label="Status Interno"
                  value={
                    <Badge variant={ativo ? 'default' : 'destructive'}>
                      {ativo ? 'Ativo' : 'Inativo'}
                    </Badge>
                  }
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Para Quem é Este Serviço?</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoItem
                  icon={Users}
                  label="Personas Relevantes"
                  value={
                    <div className="flex flex-wrap gap-2 mt-1">
                      {personas?.map((p) => (
                        <Badge key={p.id} variant="outline">
                          {p.nome}
                        </Badge>
                      ))}
                    </div>
                  }
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </LayoutPage>
  );
}
