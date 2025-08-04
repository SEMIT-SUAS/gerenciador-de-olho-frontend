export interface Secretaria  {
    id: number;
    nome: string;
    sigla: string;
    visivel: boolean;
    ativo: boolean;
};

export interface createSecretaria{
    nome: string;
    sigla: string;
    visivel: boolean;
    ativo: boolean;
}