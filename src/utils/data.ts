export function calcularDiasAtras(dataDeCriacao: string | Date): string {
  const dataAtual = new Date();
  const dataCriacao = new Date(dataDeCriacao);

  const diferencaEmMs = dataAtual.getTime() - dataCriacao.getTime();

  if (diferencaEmMs < 0) {
    return 'Data inválida';
  }

  const msPorDia = 1000 * 60 * 60 * 24;
  const diferencaEmDias = Math.floor(diferencaEmMs / msPorDia);

  if (diferencaEmDias === 0) {
    return 'hoje';
  } else if (diferencaEmDias === 1) {
    return 'há 1 dia';
  } else {
    return `há ${diferencaEmDias} dias`;
  }
}
