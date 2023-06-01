import type { DatosAgente } from '../tipos';

const infoTitulo = document.getElementById('infoTitulo') as HTMLDivElement;
const infoImg = document.getElementById('infoImg') as HTMLDivElement;
const infoPerfil = document.getElementById('infoPerfil') as HTMLDivElement;
const infoRelaciones = document.getElementById('infoRelaciones') as HTMLUListElement;

function crearParrafos(texto: string) {
  infoPerfil.innerHTML = '';
  if (!texto) return;
  const partesDesc = texto.split('\n').filter((parte) => parte.length);

  partesDesc.forEach((parte) => {
    const parrafo = document.createElement('p');
    parrafo.innerText = parte;
    infoPerfil.appendChild(parrafo);
  });
}

export const aleatorioFraccion = (min: number, max: number) => Math.random() * (max - min) + min;

export function llenarInfo(datosAgente: DatosAgente) {
  const { nombre, descripcion, img, relaciones } = datosAgente;

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

  if (infoPerfil && descripcion) crearParrafos(descripcion);

  if (infoRelaciones) {
    infoRelaciones.innerHTML = '';

    const contenedor = infoRelaciones.parentElement;

    if (relaciones.length) {
      contenedor?.classList.add('mostrar');

      // infoRelaciones.classList.add('mostrar')
      relaciones.forEach((relacion) => {
        const elemento = document.createElement('li');
        const descriptor = document.createElement('span');
        const relacionCon = document.createElement('span');

        elemento.className = 'relacion';
        descriptor.className = 'descriptor';
        relacionCon.className = 'relacionCon';

        descriptor.innerText = relacion.descriptor;
        if (relacion.con) relacionCon.innerText = relacion.con;

        if (relacion.activo) {
          elemento.classList.add('activo');
        }

        if (relacion.tipo) elemento.classList.add(relacion.tipo);

        elemento.appendChild(descriptor);
        elemento.appendChild(relacionCon);
        infoRelaciones.appendChild(elemento);
      });
    } else {
      contenedor?.classList.remove('mostrar');
    }
  }
}
