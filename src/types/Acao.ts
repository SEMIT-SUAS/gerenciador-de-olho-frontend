import type { Secretaria } from './Secretaria'
import type { StatusModel } from './StatusModel'

export interface Acao {
  id: number;
  nome: string;
  secretaria: Secretaria;
  lat: number;
  lon: number;
  polygonCoords: any[];
  status: StatusModel;
}
