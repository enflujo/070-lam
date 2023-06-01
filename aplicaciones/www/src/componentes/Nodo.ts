import { agenteActivo, estanOrbitando, mostrarAgente } from '../cerebros/general';
import type { DatosAgente, Dims, Punto } from '../tipos';

const DOS_PI = Math.PI * 2;
const conexiones = document?.querySelector<SVGGElement>('#conexiones');

export default class Nodo {
  grupo: HTMLDivElement;
  anillo: number;
  datos: DatosAgente;
  angulo: number;
  radio: number;
  centro: Punto;
  activo: boolean;
  x: number;
  y: number;
  lineas: SVGLineElement[];
  mostrarRelaciones: boolean;

  constructor(contenedor: HTMLDivElement, datos: DatosAgente, anillo: number, angulo: number, dims: Dims) {
    this.grupo = document.createElement('div');
    const texto = document.createElement('span');
    const icono = document.createElement('span');
    this.anillo = anillo;
    this.datos = datos;
    this.radio = 0;
    this.centro = { x: 0, y: 0 };
    this.angulo = angulo;
    this.activo = true;
    this.x = 0;
    this.y = 0;
    this.lineas = [];
    this.mostrarRelaciones = false;

    texto.className = 'nombre';
    texto.innerText = datos.nombre;

    icono.className = 'icono';

    this.grupo.className = 'nodo activo';
    this.grupo.appendChild(icono);
    this.grupo.appendChild(texto);
    contenedor.appendChild(this.grupo);

    this.escalar(dims);
    this.actualizar();

    this.grupo.onmouseenter = () => {
      if (!this.activo) return;
      estanOrbitando.set(false);
      mostrarAgente.set(this.datos);
      this.mostrarRelaciones = true;
    };

    this.grupo.onmouseleave = () => {
      if (!this.activo) return;
      estanOrbitando.set(true);
      this.mostrarRelaciones = false;
    };

    this.grupo.onclick = (evento) => {
      evento.stopPropagation();
      agenteActivo.set(this.datos.nombre);
      this.mostrarRelaciones = true;
    };

    if (datos.relaciones.length) {
      datos.relaciones.forEach((relacion) => {
        const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        linea.setAttribute('class', `conexion ${relacion.tipoRelacion}`);
        linea.setAttribute('data-con', relacion.con);
        conexiones?.appendChild(linea);
      });
    }
  }

  escalar(dims: Dims) {
    this.radio = this.anillo * dims.pasoR;
    this.centro = dims.centro;
    this.actualizar();
  }

  actualizar() {
    this.angulo = (this.angulo + 0.0002) % 1;
    const _x = this.radio * Math.sin(DOS_PI * this.angulo);
    const _y = this.radio * Math.cos(DOS_PI * this.angulo);
    const x = this.centro.x + _x;
    const y = this.centro.y + _y;

    this.grupo.style.transform = `translate(${x}px,${y}px)`;
    this.x = x;
    this.y = y;
  }

  activar() {
    this.grupo.classList.add('activo');
    this.activo = true;
  }

  desactivar() {
    this.grupo.classList.remove('activo');
    this.activo = false;
  }
}
