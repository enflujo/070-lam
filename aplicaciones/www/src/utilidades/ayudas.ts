import { DatosAgente } from '../tipos';

const infoTitulo = document.getElementById('infoTitulo') as HTMLDivElement;
const infoImg = document.getElementById('infoImg') as HTMLDivElement;
const infoContenido = document.getElementById('infoContenido') as HTMLDivElement;

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

export function llenarInfo(datosAgente: DatosAgente) {
  const { nombre, descripcion, img } = datosAgente;
  if (infoTitulo) infoTitulo.innerText = nombre;
  infoImg.innerHTML = '';
  if (img) {
    const foto = new Image();
    foto.onload = () => {
      infoImg.appendChild(foto);
    };
    foto.src = `/imgs/${img}`;

    foto.setAttribute('alt', `Foto de ${nombre}`);
  }
  if (infoContenido && descripcion) crearParrafos(descripcion, infoContenido);
}
