export const maskCPF = (value: string): string => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 3 primeiros dígitos
    .replace(/(\d{3})(\d)/, '$1.$2') // Coloca ponto após os 6 primeiros dígitos
    .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Coloca hífen antes dos 2 últimos dígitos
    .replace(/(-\d{2})\d+?$/, '$1'); // Limita em 11 dígitos
};

export const maskPhone = (value: string): string => {
  return value
    .replace(/\D/g, '') // Remove tudo que não é dígito
    .replace(/(\d{2})(\d)/, '($1) $2') // Coloca parênteses em volta dos 2 primeiros dígitos
    .replace(/(\d{5})(\d)/, '$1-$2') // Coloca hífen após o 5º dígito
    .replace(/(-\d{4})\d+?$/, '$1'); // Limita o número de dígitos
};

export const unmaskValue = (value: string): string => {
  return value.replace(/\D/g, '');
};
