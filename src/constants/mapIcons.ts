import L from 'leaflet';

const iconDenuncia = new L.Icon({
  iconUrl: 'sirene.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -40],
  shadowSize: [41, 41],
  shadowAnchor: [19, 41],
});

const iconDenunciaSelecionada = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconDenunciaEmAtendimento = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconAcao = new L.Icon({
  iconUrl: '/icons/acao.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -40],
  shadowSize: [41, 41],
  shadowAnchor: [19, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: 'selected-pin.png',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -40],
  shadowSize: [41, 41],
  shadowAnchor: [19, 41],
  className: 'pulse-animation',
});

export {
  iconDenuncia,
  iconDenunciaSelecionada,
  iconDenunciaEmAtendimento,
  iconAcao,
  selectedIcon,
};
