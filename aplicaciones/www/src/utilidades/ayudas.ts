export const aleatorioFraccion = (min: number, max: number) => Math.random() * (max - min) + min;
export const normalizarTexto = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
    .replace(/\s+/g, '-');

export function crearParrafos(texto: string) {
  if (!texto) return;
  const partesDesc = texto.split('\n').filter((parte) => parte.length);

  return partesDesc.map((parte) => {
    const parrafo = document.createElement('p');
    parrafo.innerText = parte;
    return parrafo;
  });
}
