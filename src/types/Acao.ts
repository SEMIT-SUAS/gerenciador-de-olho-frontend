import type { LatLngExpression } from 'leaflet';
import type { StatusModel } from './StatusModel';

export interface Acao {
  id: number;
  nome: string;
  secretaria: string;
  lat: number;
  lon: number;
  polygonCoords: any[]; 
  status: StatusModel; 
}
