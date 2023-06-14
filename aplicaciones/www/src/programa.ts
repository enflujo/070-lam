import './scss/estilos.scss';

import agentes from './datos/agentes.json';
import type { Dims } from './tipos';
import { actualizarNodos, crearNodos, escalarNodos } from './modulos/red';
import { escalarAnillos } from './modulos/anillos';
import { definirFiltros } from './modulos/filtros';
import { reiniciarTodo } from './modulos/brujeria';
import { cargarImagenes } from './modulos/imagenes';
import { crearZonas } from './modulos/zonas';

export type FuenteDatos = typeof agentes;
const svg = document.querySelector<SVGElement>('#vis');
const reiniciar = document.getElementById('reiniciar') as HTMLDivElement;
const dims: Dims = { ancho: 0, alto: 0, min: 0, pasoR: 0, centro: { x: 0, y: 0 } };
let orbitando = true;

async function inicio() {
  await cargarImagenes(agentes);
  crearZonas();
  definirFiltros(agentes);
  crearNodos(agentes);
  definirEventos();
  escalar();
  animar();
  window.onresize = escalar;
}

inicio();

export function cambiarEstadoOrbitando(estanOrbitando: boolean) {
  orbitando = estanOrbitando;
}

function definirEventos() {
  if (svg) svg.onclick = reiniciarTodo;
  reiniciar.onclick = reiniciarTodo;

  const colapsables = document.querySelectorAll<HTMLDivElement>('.tituloColapsable');

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

console.log('..:: Desarrollado por el Laboratorio EnFlujo - https://enflujo.com ::..');
