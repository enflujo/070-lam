export const aleatorioFraccion = (min: number, max: number) => Math.random() * (max - min) + min;
export const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/\s+/g, '-');
