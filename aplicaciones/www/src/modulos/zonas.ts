import { poderesActivos } from '../cerebros/general';
import poderes from '../datos/poderes.json';
import { normalizarTexto } from '../utilidades/ayudas';
import { activarPoder } from './filtros';

const contenedor = document.getElementById('contenedorZonas') as HTMLDivElement;
const elementos: { [nombre: string]: HTMLDivElement } = {};
let elementoActivo: HTMLDivElement;

export function crearZonas() {
  poderes.forEach((poder, i) => {
    const llave = normalizarTexto(poder);
    const elemento = document.createElement('div');
    const nombre = document.createElement('p');
    const icono = document.createElement('span');

    elemento.className = 'nodoPoder';
    nombre.className = 'nombre';
    icono.className = 'icono';
    nombre.innerText = poder;
    elemento.classList.add(llave);
    elemento.appendChild(icono);

    if (poder !== 'LAM') elemento.appendChild(nombre);
    contenedor.appendChild(elemento);
    elementos[llave] = elemento;

    if (poder === 'LAM') {
      elemento.style.top = '50%';
      elemento.style.left = '50%';
      elemento.style.transform = 'translate(-100%, -150%)';
    } else if (i === 1) {
      elemento.style.left = '0';
      elemento.style.top = '0';
    } else if (i === 2) {
      elemento.style.right = '0';
      elemento.style.top = '0';
    } else if (i === 3) {
      elemento.style.right = '0';
      elemento.style.bottom = '0';
    } else if (i === 4) {
      elemento.style.left = '0';
      elemento.style.bottom = '0';
    } else if (i === 5) {
      elemento.style.right = '0';
      elemento.style.bottom = '50%';
      elemento.style.transform = 'translateY(100%)';
    }

    elemento.onclick = () => {
      activarPoder(llave);
      // if (elemento.classList.contains('activo')) {
      //   desactivarZona(llave);
      // } else {
      //   activarZona(llave);
      // }
    };
  });
}

export function activarZona(llave: string) {
  if (elementoActivo) elementoActivo.classList.remove('activo');

  elementos[llave].classList.add('activo');
  elementoActivo = elementos[llave];
}

export function desactivarZona(llave: string) {
  elementos[llave].classList.remove('activo');
}

poderesActivos.subscribe((listaPoderes) => {
  for (const poder in elementos) {
    if (listaPoderes.includes(poder)) {
      elementos[poder].classList.add('activo');
    } else {
      elementos[poder].classList.remove('activo');
    }
  }
});
