import { FileText, Image, Settings } from 'lucide-react';
import { IconBallFootball } from '@tabler/icons-react';
import { useAuth } from '@/context/AuthContext';
import { LayoutPage } from '@/components/LayoutPage';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const greeting = getGreeting();

  const navigate = useNavigate();

  return (
    <LayoutPage>
      {/* Container principal que centraliza o conteúdo verticalmente, descontando a altura da navbar. */}
      <div className="flex items-center justify-center h-[calc(100vh-13rem)] px-4">
        <div className="w-full max-w-7xl">
          {' '}
          {/* Limita a largura máxima do conteúdo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Coluna da Esquerda: Saudação */}
            <div className="md:col-span-1 flex flex-col justify-center items-center md:items-end text-center md:text-right p-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
                  {greeting},
                </h1>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mt-1">
                  {user?.nome}!
                </h2>
                <p className="mt-4 text-lg text-gray-600">
                  Bem-vindo(a) ao seu painel de controle, gerencie o conteúdo e
                  as funcionalidades.
                </p>
              </div>
            </div>

            {/* Coluna da Direita: Atalhos Rápidos */}
            <div className="md:col-span-2 flex flex-col justify-center p-6">
              <h3 className="text-2xl font-semibold text-gray-700 mb-6">
                Atalhos Rápidos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="cursor-pointer"
                  onClick={() => navigate('/ocorrencias')}
                >
                  <CardHeader>
                    <FileText className="h-8 w-8 text-chart-5 mb-2" />
                    <CardTitle>Ocorrências</CardTitle>
                    <CardDescription>
                      Visualizar e gerenciar denúncias.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => navigate('/servicos')}
                  >
                    <Settings className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Serviços</CardTitle>
                    <CardDescription>
                      Cadastrar e editar serviços do app.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => navigate('/banners')}
                  >
                    <Image className="h-8 w-8 text-secondary mb-2" />
                    <CardTitle>Banners</CardTitle>
                    <CardDescription>
                      Adicionar e remover banners visuais.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer">
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => navigate('/espacos-publicos')}
                  >
                    <IconBallFootball className="h-8 w-8 text-chart-4  mb-2" />
                    <CardTitle>Espaços Públicos</CardTitle>
                    <CardDescription>
                      Gerenciar quadras e outros locais.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPage>
  );
}
