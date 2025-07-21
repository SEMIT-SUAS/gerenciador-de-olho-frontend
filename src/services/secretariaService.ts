import type { Secretaria } from '../types/Secretaria';

async function getAll(): Promise<Secretaria[]> {
  return [
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
}

export default {
  getAll,
};
