async function getByName(fileName: string): Promise<Blob> {
  try {
    let response;

    if (fileName.endsWith('.mp4')) {
      response = await fetch('/test_video_2.mp4');
    } else {
      response = await fetch('https://picsum.photos/500');
    }

    if (response.status != 200) {
      throw new Error('Não foi possível buscar por esse arquivo');
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
