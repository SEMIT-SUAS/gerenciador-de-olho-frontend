import type { CategoriaDenunciaModel } from '../types/CategoriaDenuncia';

const infraestruturaTipos = [
  {
    id: 1,
    nome: 'Buraco na rua',
    cor: '#333',
  },
];

async function getAll(): Promise<CategoriaDenunciaModel[]> {
  return [
    {
      id: 1,
      nome: 'Infraestrutura',
      tipos: infraestruturaTipos,
    },
  ];
}

async function getTipoById(tipoId: number) {
  return infraestruturaTipos.find((tipo) => tipo.id === tipoId);
}

export default {
  getAll,
  getTipoById,
};
