import L from 'leaflet'

const icons = [
  {
    name: 'Buraco na rua',
    path: 'buraco-na-rua.png',
  },
  {
    name: 'Bueiro aberto',
    path: 'bueiro-aberto.png',
  },
  {
    name: 'Capinação',
    path: 'capinacao.png',
  },
  {
    name: 'Coleta de lixo',
    path: 'coleta-de-lixo.png',
  },
  {
    name: 'Enchente',
    path: 'enchente.png',
  },
  {
    name: 'Lampada queimada',
    path: 'lampada-queimada.png',
  },
  {
    name: 'Limpeza de vias',
    path: 'limpeza-de-vias.png',
  },
]

export function getDenunciaIconByTipo(tipo: string) {
  const target = icons.find(i => i.name == tipo)
  let path = 'sirene.png'

  if (target) {
    path = target.path
  }

  return new L.Icon({
    iconUrl: path,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40],
    shadowSize: [41, 41],
    shadowAnchor: [19, 41],
  })
}
