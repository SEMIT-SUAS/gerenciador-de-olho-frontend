import type { Module } from '@/types/Module';

export const modules: Module[] = [
  {
    title: 'Ocorrências',
    to: '',
    roles: ['ADMINISTRADOR', 'COMUM'],
    childs: [
      {
        title: 'Denúncias & Ações',
        to: '/ocorrencias',
        roles: ['ADMINISTRADOR', 'COMUM'],
      },
      {
        title: 'Categorias e Tipos',
        to: '/categorias-denuncia',
        roles: ['ADMINISTRADOR', 'COMUM'],
      },
    ],
  },
  {
    title: 'Espaços',
    to: '/espacos-publicos',
    roles: ['ADMINISTRADOR', 'COMUM'],
  },
  {
    title: 'Serviços',
    to: '',
    roles: ['ADMINISTRADOR', 'COMUM'],
    childs: [
      {
        title: 'Todos os Serviços',
        to: '/servicos',
        roles: ['ADMINISTRADOR', 'COMUM'],
      },
      {
        title: 'Secretarias',
        to: '/servicos/secretarias',
        roles: ['ADMINISTRADOR', 'COMUM'],
      },
      { title: 'Personas', to: '/personas', roles: ['ADMINISTRADOR', 'COMUM'] },
      {
        title: 'Categorias',
        to: '/servicos/categorias',
        roles: ['ADMINISTRADOR', 'COMUM'],
      },
    ],
  },
  { title: 'Banners', to: '/banners', roles: ['ADMINISTRADOR', 'COMUM'] },
  { title: 'Portais', to: '/portais', roles: ['ADMINISTRADOR', 'COMUM'] },
  { title: 'Usuários', to: '/usuarios', roles: ['ADMINISTRADOR'] },
];
