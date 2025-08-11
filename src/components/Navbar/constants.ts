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
      { title: 'Secretarias', to: '/secretarias' },
      { title: 'Personas', to: '/personas' },
    ],
  },
  { title: 'Banners', to: '/banners' },
  { title: 'Portais', to: '/portais' },
  { title: 'Usuários', to: '/usuarios' },
];
