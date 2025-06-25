import type { StatusModel } from "./StatusModel";

export type Denuncia = {
    id: number;
    titulo: string;
    descricao: string;
    lat: number;
    lon: number;
    status: StatusModel;
    acaoId: number | null;
}