import type { LatLngExpression } from 'leaflet';

export  type Coords = [number, number];

export interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  lat: number;
  lon: number;
  status: 'aberto' | 'em_atendimento';
  acaoId: number | null; 
}

export interface Acao {
  id: number;
  nome: string;
  secretaria: string;
  lat: number;
  lon: number;
  polygonCoords: LatLngExpression[];
}

