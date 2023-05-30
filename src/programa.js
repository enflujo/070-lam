import './scss/estilos.scss';
import agentes from './datos/agentes.json';
import organizaciones from './datos/organizaciones.json';
import personas from './datos/personas.json';
import { crearParrafos } from './utilidades/ayudas';

const nodos = [];
const svg = document.getElementById('vis');
const contenedorCirculos = vis.getElementById('circulos');
const circulos = contenedorCirculos.querySelectorAll('circle');
const contenedorInfo = document.getElementById('info');
const tituloInfo = document.getElementById('tituloInfo');
const contenidoInfo = document.getElementById('contenidoInfo');
const DOS_PI = Math.PI * 2;
const dims = { ancho: 0, alto: 0, min: 0, pasoR: 0, centro: { x: 0, y: 0 } };
let orbitando = true;
let leer = false;

class Nodo {
  constructor(contenedor, datos, anillo, dims, esOrganizacion) {
    this.grupo = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const icono = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const nodoTexto = document.createTextNode(datos.nombre);
    this.anillo = anillo;
    this.datos = datos;
    this.angulo = (Math.random() * 360) | 0;
    this.esOrganizacion = esOrganizacion;

    texto.setAttribute('class', 'nombre');
    texto.appendChild(nodoTexto);
    icono.setAttribute('fill', '#d53f26');
    icono.setAttribute('r', 5);
    icono.fill = 'red';

    this.grupo.setAttribute('class', 'nodo');
    this.grupo.appendChild(icono);
    this.grupo.appendChild(texto);
    contenedor.appendChild(this.grupo);

    this.escalar(dims);
    this.actualizar();

    this.grupo.onmouseenter = () => {
      orbitando = false;
      this.llenarInfo();
    };

    this.grupo.onmouseleave = () => {
      orbitando = true;
      if (leer) return;
      contenedorInfo.classList.remove('conAgente');
      inicio();
    };

    this.grupo.onclick = (evento) => {
      evento.stopPropagation();
      leer = true;
    };
  }

  llenarInfo() {
    contenedorInfo.classList.add('conAgente');
    tituloInfo.innerText = this.datos.nombre;
    crearParrafos(this.datos.descripcion, contenidoInfo);
  }

  escalar(dims) {
    this.radio = this.anillo * dims.pasoR;
    this.centro = dims.centro;
  }

  actualizar() {
    this.angulo = (this.angulo + 0.1) % 360;
    const _x = this.radio * Math.sin((DOS_PI * this.angulo) / 360);
    const _y = this.radio * Math.cos((DOS_PI * this.angulo) / 360);
    const x = this.centro.x + _x;
    const y = this.centro.y + _y;
    this.grupo.setAttribute('transform', `translate(${x},${y})`);
  }
}

inicio();
escalar();
crearNodos();
animar();

window.onresize = escalar;
svg.onclick = () => {
  contenedorInfo.classList.remove('conAgente');
  leer = false;
  inicio();
};

function inicio() {
  const infoLazos = organizaciones.find((obj) => obj.nombre.toLowerCase() === 'lazos de amor mariano');
  tituloInfo.innerText = infoLazos.nombre;
  crearParrafos(infoLazos.descripcion, contenidoInfo);
}

function escalar() {
  const _dims = svg.getBoundingClientRect();
  const ladoMin = Math.min(_dims.width, _dims.height);
  const centro = { x: _dims.width / 2, y: _dims.height / 2 };
  const pasoRadio = ladoMin / 12;

  vis.setAttribute('width', _dims.width);
  vis.setAttribute('height', _dims.height);
  circulos.forEach((circulo, i) => {
    circulo.setAttribute('cx', centro.x);
    circulo.setAttribute('cy', centro.y);
    circulo.setAttribute('r', (i + 1) * pasoRadio);
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
  const cantidades = agentes.reduce(
    (acumulado, obj) => {
      acumulado[obj.grado]++;
      return acumulado;
    },
    [0, 0, 0, 0, 0]
  );

  agentes.forEach((agente) => {
    if (agente.nombre !== 'Lazos de amor mariano') {
      const anillo = agente.grado + 1;
      const organizacion = organizaciones.find((obj) => obj.nombre === agente.nombre);

      let persona;

      if (!organizacion) {
        persona = personas.find((obj) => obj.nombre === agente.nombre);
      }

      nodos.push(new Nodo(svg, organizacion || persona, anillo, dims, !!organizacion));
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
