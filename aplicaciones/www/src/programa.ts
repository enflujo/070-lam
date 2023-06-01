import './scss/estilos.scss';

import type { Dims } from './tipos';
import { agenteActivo, estanOrbitando, leyendo, mostrarAgente, nodos } from './cerebros/general';
import { actualizarNodos, crearNodos, escalarNodos } from './utilidades/elementosRed';
import { escalarAnillos } from './utilidades/anillos';

const svg = document.querySelector<SVGElement>('#vis');

const colapsables = document.querySelectorAll<HTMLDivElement>('.infoSeccion h3');
const dims: Dims = { ancho: 0, alto: 0, min: 0, pasoR: 0, centro: { x: 0, y: 0 } };

let orbitando = true;

crearNodos();
definirEventos();
// inicio();
escalar();

animar();
window.onresize = escalar;

function definirEventos() {
  if (svg) {
    svg.onclick = () => {
      mostrarAgente.set(null);
      agenteActivo.set(null);
      leyendo.set(false);
    };
  }

  estanOrbitando.subscribe((valor) => {
    orbitando = valor;
  });

  colapsables.forEach((titulo) => {
    titulo.onclick = () => {
      const contenedor = titulo.parentElement;
      if (contenedor) {
        if (contenedor.classList.contains('cerrado')) {
          contenedor.classList.remove('cerrado');
        } else {
          contenedor.classList.add('cerrado');
        }
      }
    };
  });
}

// function inicio() {
//   const infoLazos = agentes.find((obj) => obj.nombre.toLowerCase() === 'lazos de amor mariano') as DatosAgente;

//   if (infoLazos) {
//     llenarInfo(infoLazos);
//   }
// }

function escalar() {
  const _dims = svg?.getBoundingClientRect();

  if (!_dims) return;
  const ladoMin = Math.min(_dims.width, _dims.height);
  const centro = { x: _dims.width / 2, y: _dims.height / 2 };
  const pasoRadio = ladoMin / 12;

  svg?.setAttribute('width', `${_dims.width}`);
  svg?.setAttribute('height', `${_dims.height}`);

  escalarAnillos(centro, pasoRadio);

  dims.ancho = _dims.width;
  dims.alto = _dims.height;
  dims.min = ladoMin;
  dims.pasoR = pasoRadio;
  dims.centro = centro;

  escalarNodos(dims);
}

function animar() {
  requestAnimationFrame(animar);
  if (!orbitando) return;
  actualizarNodos();
}

console.log('..:: Desarrollado por el Laboratorio EnFlujo - http://enflujo.com ::..');
