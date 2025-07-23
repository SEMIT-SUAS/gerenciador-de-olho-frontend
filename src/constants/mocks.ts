import type { DenunciaModel } from '../types/Denuncia';

export const userMock = {
  id: 1,
  nome: 'Usuário Mock',
  cpf: '000.000.000-00',
  telefone: '000000000',
  email: 'mock@mock.com',
  senha: '',
  secretaria: {
    id: 1,
    nome: 'Secretaria Mock',
    sigla: 'SM',
  },
  perfil: {
    id: 1,
    nome: 'Cidadão',
  },
  criadoEm: new Date().toISOString(),
  criadoPor: null,
};

export const secretariasMock = [
  {
    id: 1,
    nome: 'Secretaria Municipal de Obras e Serviços Públicos',
    sigla: 'SEMOSP',
  },
  { id: 2, nome: 'Secretaria Municipal de Saúde', sigla: 'SEMUS' },
  { id: 3, nome: 'Secretaria Municipal de Educação', sigla: 'SEMED' },
  {
    id: 4,
    nome: 'Secretaria Municipal de Trânsito e Transportes',
    sigla: 'SMTT',
  },
  {
    id: 5,
    nome: 'Secretaria Municipal de Urbanismo e Habitação',
    sigla: 'SEMURH',
  },
  {
    id: 6,
    nome: 'Secretaria Municipal da Criança e Assistência Social',
    sigla: 'SEMCAS',
  },
  { id: 7, nome: 'Secretaria Municipal de Meio Ambiente', sigla: 'SEMMAM' },
  {
    id: 8,
    nome: 'Secretaria Municipal de Planejamento e Desenvolvimento',
    sigla: 'SEPLAN',
  },
  { id: 9, nome: 'Secretaria Municipal de Governo', sigla: 'SEMGOV' },
  {
    id: 10,
    nome: 'Secretaria Municipal de Segurança com Cidadania',
    sigla: 'SEMUSC',
  },
  {
    id: 11,
    nome: 'Secretaria Municipal de Agricultura, Pesca e Abastecimento',
    sigla: 'SEMAPA',
  },
  { id: 12, nome: 'Secretaria Municipal de Cultura', sigla: 'SECULT' },
  {
    id: 13,
    nome: 'Secretaria Municipal de Desportos e Lazer',
    sigla: 'SEMDEL',
  },
  { id: 14, nome: 'Secretaria Municipal da Fazenda', sigla: 'SEMFAZ' },
  { id: 15, nome: 'Secretaria Municipal de Turismo', sigla: 'SETUR' },
];

export const denunciasMock: DenunciaModel[] = [
  {
    id: 1,
    descricao:
      'Poste com lâmpada queimada há mais de uma semana, deixando a rua totalmente escura e perigosa à noite.',
    tipo: {
      id: 8,
      nome: 'Lampada queimada',
      categoria: { id: 2, nome: 'Infraestrutura' },
      cor: '#333',
    },
    files: [],
    acao: null,
    bairro: "Ponta d'Areia",
    rua: 'Avenida Litorânea',
    pontoDeReferencia: 'Próximo ao quiosque Parada Obrigatória',
    longitude: -44.2929,
    latitude: -2.4921,
    criadaEm: new Date('2025-07-20T10:00:00Z').toISOString(),
    usuario: userMock,
    denunciaIndeferida: null,
  },
  {
    id: 2,
    descricao:
      'Grande quantidade de lixo e entulho acumulado na calçada, atraindo pragas e dificultando a passagem de pedestres.',
    tipo: {
      id: 6,
      nome: 'Coleta de lixo',
      categoria: { id: 2, nome: 'Infraestrutura' },
      cor: '#333',
    },
    files: [],
    acao: null,
    bairro: 'Centro',
    rua: 'Rua do Giz',
    pontoDeReferencia: 'Em frente ao Museu Histórico e Artístico do Maranhão',
    longitude: -44.3055,
    latitude: -2.5283,
    criadaEm: new Date('2025-07-21T14:30:00Z').toISOString(),
    usuario: userMock,
    denunciaIndeferida: null,
  },
  {
    id: 3,
    descricao:
      'Buraco de grande proporção no asfalto, causando risco de acidentes para veículos que trafegam na via.',
    tipo: {
      id: 4,
      nome: 'Buraco na rua',
      categoria: { id: 2, nome: 'Infraestrutura' },
      cor: '#333',
    },
    files: [],
    acao: null,
    bairro: 'Renascença',
    rua: 'Avenida Colares Moreira',
    pontoDeReferencia: 'Perto da entrada do Tropical Shopping',
    longitude: -44.2825,
    latitude: -2.5089,
    criadaEm: new Date('2025-07-22T08:00:00Z').toISOString(),
    usuario: userMock,
    denunciaIndeferida: null,
  },
];
