import type { DatosAgente, Dims, Punto } from '../tipos';

const DOS_PI = Math.PI * 2;

export default class Nodo {
  grupo: HTMLDivElement;
  anillo: number;
  datos: DatosAgente;
  angulo: number;
  radio: number;
  centro: Punto;

  constructor(contenedor: HTMLDivElement, datos: DatosAgente, anillo: number, angulo: number, dims: Dims) {
    this.grupo = document.createElement('div');
    const texto = document.createElement('span');
    const icono = document.createElement('span');
    this.anillo = anillo;
    this.datos = datos;
    this.radio = 0;
    this.centro = { x: 0, y: 0 };
    this.angulo = angulo;

    texto.className = 'nombre';
    texto.innerText = datos.nombre;

    icono.className = 'icono';

    this.grupo.className = 'nodo';
    this.grupo.appendChild(icono);
    this.grupo.appendChild(texto);
    contenedor.appendChild(this.grupo);

    this.escalar(dims);
    this.actualizar();

    this.grupo.onmouseenter = () => {
      document.dispatchEvent(new CustomEvent('orbitando', { detail: { orbitando: false } }));
      document.dispatchEvent(new CustomEvent('agente', { detail: { conAgente: true, datos: this.datos } }));
    };

    this.grupo.onmouseleave = () => {
      document.dispatchEvent(new CustomEvent('orbitando', { detail: { orbitando: true } }));
    };

    this.grupo.onclick = (evento) => {
      evento.stopPropagation();
    };
  }

  escalar(dims: Dims) {
    this.radio = this.anillo * dims.pasoR;
    this.centro = dims.centro;
  }

  actualizar() {
    this.angulo = (this.angulo + 0.0002) % 1;
    const _x = this.radio * Math.sin(DOS_PI * this.angulo);
    const _y = this.radio * Math.cos(DOS_PI * this.angulo);
    const x = this.centro.x + _x;
    const y = this.centro.y + _y;

    this.grupo.style.transform = `translate(${x}px,${y}px)`;
  }
}
