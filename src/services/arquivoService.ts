export class ArquivoService {
  private static SERVICE_UNAVAILABLE_ERROR = new Error(
    'Serviço de arquivos indisponível. Tente novamente mais tarde.',
  );

  public static async getFileBlobByURL(url: string): Promise<Blob> {
    try {
      const response = await fetch(url);

      if (response.status !== 200) {
        throw new Error('Não foi possível buscar esse arquivo.');
      }

      return await response.blob();
    } catch (error) {
      throw this.SERVICE_UNAVAILABLE_ERROR;
    }
  }
}
