export function crearParrafos(texto: string, contenedor: HTMLDivElement) {
  contenedor.innerHTML = '';
  if (!texto) return;
  const partesDesc = texto.split('\n').filter((parte) => parte.length);

  partesDesc.forEach((parte) => {
    const parrafo = document.createElement('p');
    parrafo.innerText = parte;
    contenedor.appendChild(parrafo);
  });
}

export const aleatorioFraccion = (min: number, max: number) => Math.random() * (max - min) + min;
