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
  { title: 'Espaços', to: '/espacos-publicos' },
  {
    title: 'Serviços',
    to: '',
    childs: [
      { title: 'Todos os Serviços', to: '/servicos' },
      { title: 'Secretarias', to: '/servicos/secretarias' },
      { title: 'Personas', to: '/personas' },
      { title: 'Categorias', to: '/servicos/categorias' },
    ],
  },
  { title: 'Banners', to: '/banners' },
  { title: 'Portais', to: '/portais' },
  { title: 'Usuários', to: '/usuarios' },
];
