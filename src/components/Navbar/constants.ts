import type { Module } from './types';

export const modules: Module[] = [
  { title: 'Ocorrências', to: '/ocorrencias' },
  { title: 'Reserva', to: '/reserva' },
  {
    title: 'Serviços',
    to: '/servicos',
    childs: [
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
