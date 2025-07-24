async function getByName(_: string): Promise<Blob> {
  try {
    const response = await fetch('https://picsum.photos/200');

    if (response.status != 200) {
      throw new Error('Não foi possível buscar por essa imagem');
    }

    return (await response.blob()) as Blob;
  } catch {
    throw new Error(
      'Serviço de arquivos fora do ar. Tente novamente mais tarde.',
    );
  }
}

export default {
  getByName,
};
