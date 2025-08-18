export type BairroCoordenadas = number[][][][];

export interface Bairro {
    id: number;
    nome: string;
    centerLatitude: number;
    centerLongitude: number;
    quantidadeAcoes: number;
    quantidadeDenuncias: number
    coordenadas: BairroCoordenadas;
}