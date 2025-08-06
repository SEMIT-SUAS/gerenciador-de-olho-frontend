import type { Module } from './types';

export const modules: Module[] = [
  { title: 'Ocorrências', to: '/ocorrencias' },
  { title: 'Reserva', to: '/reserva' },
  {
    title: 'Serviços',
    to: '/servicos',
    childs: [
      { title: 'Secretarias', to: '/secretarias' },
      { title: 'Personas', to: '/personas' },
    ],
  },
  { title: 'Banners', to: '/banners' },
  { title: 'Portais', to: '/portais' },
  { title: 'Usuários', to: '/usuarios' },
];
