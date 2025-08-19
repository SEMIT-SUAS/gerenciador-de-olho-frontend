export type Ponto = number[];
export type Poligono = Ponto[];
export type MultiPoligono = Poligono[];
export type BairroCoordenadas = MultiPoligono;

export interface Bairro {
  id: number;
  nome: string;
  centerLatitude: number;
  centerLongitude: number;
  coordenadas: BairroCoordenadas;
}
