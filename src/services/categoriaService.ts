import type { CategoriaDenunciaModel } from '../types/CategoriaDenuncia';

const acessibilidadeTipos = [
  { id: 1, nome: 'Acessibilidade irregular' },
  { id: 2, nome: 'Falta de acessibilidade' },
];

const infraestruturaTipos = [
  { id: 3, nome: 'Bueiro aberto' },
  { id: 4, nome: 'Buraco na rua' },
  { id: 5, nome: 'Capinacao' },
  { id: 6, nome: 'Coleta de lixo' },
  { id: 7, nome: 'Enchente' },
  { id: 8, nome: 'Lampada queimada' },
  { id: 9, nome: 'Limpeza de vias' },
  { id: 10, nome: 'Manutencao praca publica' },
  { id: 11, nome: 'Manutencao predio publico' },
  { id: 12, nome: 'Manutencao quadra' },
  { id: 13, nome: 'Podar arvores' },
  { id: 14, nome: 'Sem asfalto' },
];

const meioAmbienteTipos = [
  { id: 15, nome: 'Descarte ilegal' },
  { id: 16, nome: 'Desmatamento ilegal' },
  { id: 17, nome: 'Poluicao sonora' },
];

const saudePublicaTipos = [
  { id: 18, nome: 'Falta de medicamento' },
  { id: 19, nome: 'Foco de dengue' },
];

const transitoETransporteTipos = [
  { id: 20, nome: 'Estacionamento irregular' },
  { id: 21, nome: 'Ma sinalizacao' },
  { id: 22, nome: 'Semaforo quebrado' },
];

async function getAll(): Promise<CategoriaDenunciaModel[]> {
  return [
    {
      id: 1,
      nome: 'Acessibilidade',
      cor: '#FF5733',
      tipos: acessibilidadeTipos,
    },
    {
      id: 2,
      nome: 'Infraestrutura',
      cor: '#333',
      tipos: infraestruturaTipos,
    },
    {
      id: 3,
      nome: 'Meio Ambiente',
      cor: '#33FF57',
      tipos: meioAmbienteTipos,
    },
    {
      id: 4,
      nome: 'Saúde Pública',
      cor: '#5733FF',
      tipos: saudePublicaTipos,
    },
    {
      id: 5,
      nome: 'Trânsito e Transporte',
      cor: '#A1FF33',
      tipos: transitoETransporteTipos,
    },
  ];
}

async function getTipoById(tipoId: number) {
  const allTipos = [
    ...acessibilidadeTipos,
    ...infraestruturaTipos,
    ...meioAmbienteTipos,
    ...saudePublicaTipos,
    ...transitoETransporteTipos,
  ];
  return allTipos.find((tipo) => tipo.id === tipoId);
}

export default {
  getAll,
  getTipoById,
};
