import type { Module } from './types';

export const modules: Module[] = [
  { title: 'Ocorrências', to: '/ocorrencias' },
  { title: 'Reserva', to: '/reserva' },
  {
    title: 'Serviços',
    childs: [
      { title: 'Serviço A', to: '/servicos/a' },
      { title: 'Serviço B', to: '/servicos/b' },
    ],
  },
  { title: 'Banners', to: '/banners' },
  { title: 'Portais', to: '/portais' },
  { title: 'Usuários', to: '/usuarios' },
];
