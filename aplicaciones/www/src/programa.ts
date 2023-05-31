import './scss/estilos.scss';
import agentes from './datos/agentes.json';
import { aleatorioFraccion, crearParrafos } from './utilidades/ayudas';
import type { Dims } from './tipos';
import Nodo from './componentes/Nodo';

const nodos: Nodo[] = [];
const svg = document.querySelector<SVGElement>('#vis');
const contenedorCirculos = svg?.querySelector<SVGGElement>('#circulos');
const circulos = contenedorCirculos?.querySelectorAll<SVGCircleElement>('circle');
const contenedorAgentes = document.getElementById('contenedorAgentes') as HTMLDivElement;
const contenedorInfo = document.getElementById('info');
const tituloInfo = document.getElementById('tituloInfo') as HTMLDivElement;
const contenidoInfo = document.querySelector<HTMLDivElement>('#contenidoInfo');
const agentesFlotantes = agentes.filter((agente) => agente.nombre !== 'Lazos de amor mariano');

const dims: Dims = { ancho: 0, alto: 0, min: 0, pasoR: 0, centro: { x: 0, y: 0 } };
let orbitando = true;
let leer = false;

definirEventos();
inicio();
escalar();
crearNodos();
animar();
window.onresize = escalar;

function definirEventos() {
  document.addEventListener('agente', (evento: CustomEventInit) => {
    if (evento.detail.conAgente) {
      contenedorInfo?.classList.add('conAgente');
      const { nombre, descripcion } = evento.detail.datos;
      if (tituloInfo) tituloInfo.innerText = nombre;
      if (contenidoInfo && descripcion) crearParrafos(descripcion, contenidoInfo);
    } else {
      contenedorInfo?.classList.remove('conAgente');
      inicio();
    }
  });

  document.addEventListener('orbitando', (evento: CustomEventInit) => {
    orbitando = evento.detail.orbitando;
  });

  document.addEventListener('leer', (evento: CustomEventInit) => {
    leer = evento.detail.leer;
  });

  if (svg) {
    svg.onclick = () => {
      contenedorInfo?.classList.remove('conAgente');
      leer = false;
      inicio();
    };
  }
}

function inicio() {
  const infoLazos = agentes.find((obj) => obj.nombre.toLowerCase() === 'lazos de amor mariano');

  if (infoLazos && contenidoInfo) {
    tituloInfo.innerText = infoLazos.nombre;
    crearParrafos(infoLazos.descripcion || '', contenidoInfo);
  }
}

function escalar() {
  const _dims = svg?.getBoundingClientRect();

  if (!_dims) return;
  const ladoMin = Math.min(_dims.width, _dims.height);
  const centro = { x: _dims.width / 2, y: _dims.height / 2 };
  const pasoRadio = ladoMin / 12;

  svg?.setAttribute('width', `${_dims.width}`);
  svg?.setAttribute('height', `${_dims.height}`);

  circulos?.forEach((circulo, i) => {
    circulo.setAttribute('cx', `${centro.x}`);
    circulo.setAttribute('cy', `${centro.y}`);
    circulo.setAttribute('r', `${(i + 1) * pasoRadio}`);
  });

  dims.ancho = _dims.width;
  dims.alto = _dims.height;
  dims.min = ladoMin;
  dims.pasoR = pasoRadio;
  dims.centro = centro;

  if (nodos.length) {
    nodos.forEach((nodo) => {
      nodo.escalar(dims);
    });
  }
}

function crearNodos() {
  const cantidades = agentesFlotantes.reduce(
    (acumulado, obj) => {
      acumulado[obj.grado]++;
      return acumulado;
    },
    [0, 0, 0, 0, 0]
  );

  const posiciones = cantidades.map((total) => {
    return { paso: 1 / total, i: 0, total };
  });

  agentesFlotantes.forEach((agente) => {
    const anillo = agente.grado + 1;

    if (svg) {
      const anguloMax = posiciones[agente.grado].i * posiciones[agente.grado].paso;
      const anguloMin = anguloMax - posiciones[agente.grado].paso * 0.5;
      const angulo = aleatorioFraccion(anguloMin, anguloMax);
      nodos.push(new Nodo(contenedorAgentes, agente, anillo, angulo, dims));
      posiciones[agente.grado].i++;
    }
  });
}

function animar() {
  requestAnimationFrame(animar);

  if (!orbitando) return;
  nodos.forEach((nodo) => {
    nodo.actualizar();
  });
}

console.log('..:: Desarrollado por el Laboratorio EnFlujo - http://enflujo.com ::..');
