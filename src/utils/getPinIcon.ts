import L, { type PointExpression } from 'leaflet';

const icons = [
  {
    name: 'Acessibilidade irregular',
    path: '/acessibilidade/acessibilidade-irregular.png',
  },
  {
    name: 'Falta de acessibilidade',
    path: '/acessibilidade/falta-de-acessibilidade.png',
  },
  {
    name: 'Bueiro aberto',
    path: '/infraestrutura/bueiro-aberto.png',
  },
  {
    name: 'Buraco na rua',
    path: '/infraestrutura/buraco-na-rua.png',
  },
  {
    name: 'Capinacao',
    path: '/infraestrutura/capinacao.png',
  },
  {
    name: 'Coleta de lixo',
    path: '/infraestrutura/coleta-de-lixo.png',
  },
  {
    name: 'Enchente',
    path: '/infraestrutura/enchente.png',
  },
  {
    name: 'Lampada queimada',
    path: '/infraestrutura/lampada-queimada.png',
  },
  {
    name: 'Limpeza de vias',
    path: '/infraestrutura/limpeza-de-vias.png',
  },
  {
    name: 'Manutencao praca publica',
    path: '/infraestrutura/manutencao-praca-publica.png',
  },
  {
    name: 'Manutencao predio publico',
    path: '/infraestrutura/manutencao-predio-publico.png',
  },
  {
    name: 'Manutencao quadra',
    path: '/infraestrutura/manutencao-quadra.png',
  },
  {
    name: 'Podar arvores',
    path: '/infraestrutura/podar-arvores.png',
  },
  {
    name: 'Sem asfalto',
    path: '/infraestrutura/sem-asfalto.png',
  },
  {
    name: 'Descarte ilegal',
    path: '/meio-ambiente/descarte-ilegal.png',
  },
  {
    name: 'Desmatamento ilegal',
    path: '/meio-ambiente/desmatamento-ilegal.png',
  },
  {
    name: 'Poluicao sonora',
    path: '/meio-ambiente/poluicao-sonora.png',
  },
  {
    name: 'Falta de medicamento',
    path: '/saude-publica/falta-de-medicamento.png',
  },
  {
    name: 'Foco de dengue',
    path: '/saude-publica/foco-de-dengue.png',
  },
  {
    name: 'Estacionamento irregular',
    path: '/transito-e-transporte/estacionamento-irregular.png',
  },
  {
    name: 'Ma sinalizacao',
    path: '/transito-e-transporte/ma-sinalizacao.png',
  },
  {
    name: 'Semaforo quebrado',
    path: '/transito-e-transporte/semaforo-quebrado.png',
  },
];

export function getDenunciaIconByTipo(tipo: string, isSelected: boolean) {
  const target = icons.find((i) => i.name === tipo);
  let iconPath = '/icons/denuncia.png';

  if (target) {
    iconPath = target.path;
  }

  const iconSize = isSelected ? 38 : 32;
  const iconAnchor: PointExpression = [iconSize / 2, iconSize];
  const popupAnchor: PointExpression = [0, -iconSize];

  return new L.Icon({
    iconUrl: iconPath,
    iconSize: [iconSize, iconSize],
    iconAnchor,
    popupAnchor,
    shadowSize: [41, 41],
    shadowAnchor: [12, 41],
  });
}
