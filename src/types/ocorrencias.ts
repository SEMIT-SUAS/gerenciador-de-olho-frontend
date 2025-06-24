import type { LatLngExpression } from 'leaflet';
import type { StatusModel } from './StatusModel';

export  type Coords = [number, number];

export interface Denuncia {
  id: number;
  titulo: string;
  descricao: string;
  lat: number;
  lon: number;
  status: StatusModel;
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

