import type { Module } from './types';

export const modules: Module[] = [
  {
    title: 'Ocorrências',
    to: '',
    childs: [
      {
        title: 'Denúncias & Ações',
        to: '/ocorrencias',
      },
      {
        title: 'Categorias',
        to: '/categorias-denuncia',
      },
      {
        title: 'Tipos',
        to: '/tipos-denuncia',
      },
    ],
  },
  { title: 'Reserva', to: '/reserva' },
  {
    title: 'Serviços',
    to: '',
    childs: [
      { title: 'Todos os Serviços', to: '/servicos' },
      { title: 'Carta de Serviços', to: '/servicos' },
      { title: 'Serviços Externos', to: 'servicos-externos' },
      { title: 'Secretarias', to: '/secretarias' },
      { title: 'Personas', to: '/personas' },
      { title: 'Categorias', to: '/categorias-servicos' },
    ],
  },
  { title: 'Banners', to: '/banners' },
  { title: 'Portais', to: '/portais' },
  { title: 'Usuários', to: '/usuarios' },
];
