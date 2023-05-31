import './scss/estilos.scss';
import agentes from './datos/agentes.json';
import { aleatorioFraccion, llenarInfo } from './utilidades/ayudas';
import type { DatosAgente, Dims } from './tipos';
import Nodo from './componentes/Nodo';
import { agenteActivo, estanOrbitando, leyendo, mostrarAgente } from './cerebros/general';

const nodos: Nodo[] = [];
const svg = document.querySelector<SVGElement>('#vis');
const contenedorCirculos = svg?.querySelector<SVGGElement>('#circulos');
const circulos = contenedorCirculos?.querySelectorAll<SVGCircleElement>('circle');
const contenedorAgentes = document.getElementById('contenedorAgentes') as HTMLDivElement;
const corazon = document.getElementById('corazon') as HTMLSpanElement;
const contenedorInfo = document.getElementById('info') as HTMLDivElement;
const agentesFlotantes = agentes.filter((agente) => agente.nombre !== 'Lazos de amor mariano') as DatosAgente[];
const dims: Dims = { ancho: 0, alto: 0, min: 0, pasoR: 0, centro: { x: 0, y: 0 } };
let orbitando = true;

definirEventos();
inicio();
escalar();
crearNodos();
animar();
window.onresize = escalar;

function definirEventos() {
  document.addEventListener('activarAgente', (evento: CustomEventInit) => {
    nodos.forEach((nodo) => {
      if (nodo.datos.nombre === evento.detail.datos.nombre) {
        console.log('j', evento.detail.datos.nombre);
        nodo.activar();
      } else {
        nodo.desactivar();
      }
    });
  });

  if (svg) {
    svg.onclick = () => {
      mostrarAgente.set(null);
      agenteActivo.set(null);
    };
  }

  corazon.onmouseenter = () => {
    mostrarAgente.set(null);
  };

  leyendo.subscribe((estaLeyendo) => {
    console.log('leyendo', estaLeyendo);
  });

  estanOrbitando.subscribe((valor) => {
    orbitando = valor;
  });

  mostrarAgente.subscribe((agente) => {
    if (agente) {
      const { tipo } = agente;
      contenedorInfo.classList.add(tipo);

      if (tipo === 'org') {
        contenedorInfo.classList.remove('lam');
        contenedorInfo.classList.remove('persona');
      } else {
        contenedorInfo.classList.remove('lam');
        contenedorInfo.classList.remove('org');
      }
      llenarInfo(agente);
    } else {
      contenedorInfo.classList.add('lam');
      contenedorInfo.classList.remove('persona');
      contenedorInfo.classList.remove('org');
      inicio();
    }
  });

  agenteActivo.subscribe((nombre) => {
    if (nombre) {
      nodos.forEach((nodo) => {
        if (nodo.datos.nombre === nombre) {
          nodo.activar();
        } else {
          nodo.desactivar();
        }
      });

      leyendo.set(true);
    } else {
      nodos.forEach((nodo) => {
        nodo.activar();
      });

      leyendo.set(false);
    }
  });
}

function inicio() {
  const infoLazos = agentes.find((obj) => obj.nombre.toLowerCase() === 'lazos de amor mariano') as DatosAgente;

  if (infoLazos) {
    llenarInfo(infoLazos);
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

  agentesFlotantes.forEach((agente: DatosAgente) => {
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
