import { agenteActivo, leyendo, mostrarAgente } from '../cerebros/general';
import type { DatosAgente, Dims, NodoRelacion, Punto, Relacion, TipoAgente } from '../tipos';
import { crearLineaDeRelacion, eventoNodosRelacionados, prenderTodos } from './red';
import { normalizarTexto } from '../utilidades/ayudas';
import { crearInfo } from './columnaInfo';
import { cambiarEstadoOrbitando } from '../programa';

const DOS_PI = Math.PI * 2;

export default class Nodo {
  nombre: string;
  llave: string;
  tipo: TipoAgente;
  poder: string;
  relaciones: Relacion[];
  relacionesInvertidas: Relacion[];

  elemento: HTMLDivElement;
  anillo: number;
  angulo: number;
  radio: number;
  centro: Punto;
  activo: boolean;
  x: number;
  y: number;
  lineas: NodoRelacion[];
  mostrarRelaciones: boolean;
  perfil?: HTMLParagraphElement[];
  foto?: HTMLImageElement;
  listaRelaciones?: HTMLLIElement[];
  nodosRelacionados: number[];

  constructor(datos: DatosAgente, anillo: number, angulo: number) {
    /**
     * Datos generales
     */
    this.nombre = datos.nombre;
    this.llave = normalizarTexto(datos.nombre);
    this.tipo = datos.tipo;
    this.poder = normalizarTexto(datos.circulo_1);
    this.relaciones = datos.relaciones;
    this.relacionesInvertidas = datos.relacionesInvertidas;
    this.anillo = anillo;
    this.radio = 0;
    this.centro = { x: 0, y: 0 };
    this.angulo = angulo;
    this.activo = true;
    this.x = 0;
    this.y = 0;

    /**
     * Elementos de HTML
     */
    this.lineas = [];
    this.nodosRelacionados = [];
    this.elemento = document.createElement('div');

    const elementos = crearInfo(datos);
    if (elementos.foto) this.foto = elementos.foto;
    if (elementos.perfil) this.perfil = elementos.perfil;
    if (elementos.relaciones) this.listaRelaciones = elementos.relaciones;

    const texto = document.createElement('span');
    const icono = document.createElement('span');
    texto.className = 'nombre';
    texto.innerText = datos.nombre_corto;
    icono.className = 'icono';
    this.elemento.className = 'nodo activo';
    this.elemento.appendChild(icono);
    this.elemento.appendChild(texto);

    /**
     * Eventos sobre elementos de HTML
     */
    this.elemento.onmouseenter = this.eventoRatonEncima;
    this.elemento.onmouseleave = this.eventoRatonFuera;
    this.elemento.onclick = this.eventoClic;

    /**
     * Estados
     */
    this.mostrarRelaciones = false;
  }

  eventoRatonEncima = () => {
    if (!this.activo) return;

    cambiarEstadoOrbitando(false);
    mostrarAgente.set(this);
    eventoNodosRelacionados(this.nodosRelacionados, this);
    this.mostrarRelaciones = true;
  };

  eventoRatonFuera = () => {
    cambiarEstadoOrbitando(true);

    if (!this.activo || leyendo.get()) return;
    prenderTodos();
    mostrarAgente.set(null);
  };

  eventoClic = (evento: Event) => {
    evento.stopPropagation();

    if (leyendo.get()) {
      agenteActivo.set(null);
      this.elemento.classList.remove('ejePrincipal');
    } else {
      this.elemento.classList.add('ejePrincipal');
      this.mostrarRelaciones = true;
      agenteActivo.set(this.nombre);
    }
  };

  escalar(dims: Dims) {
    this.radio = this.anillo * dims.pasoR;
    this.centro = dims.centro;
    this.actualizar();
  }

  /**
   * Mover el nodo a su nueva posición en la animación.
   */
  actualizar() {
    this.angulo = (this.angulo + 0.0002) % 1;
    const _x = this.radio * Math.sin(DOS_PI * this.angulo);
    const _y = this.radio * Math.cos(DOS_PI * this.angulo);
    const x = this.centro.x + _x;
    const y = this.centro.y + _y;

    this.elemento.style.transform = `translate(${x}px,${y}px)`;
    this.x = x;
    this.y = y;
  }

  activar() {
    this.elemento.classList.add('activo');
    this.activo = true;
  }

  desactivar() {
    this.elemento.classList.remove('activo');
    this.activo = false;
  }

  cambiarEstadoApagado(apagado: boolean) {
    if (apagado) {
      this.elemento.classList.add('apagado');
    } else {
      this.elemento.classList.remove('apagado');
    }
  }

  definirRelaciones() {
    if (this.relaciones.length) {
      this.lineas = this.relaciones.map((relacion) => {
        return crearLineaDeRelacion(relacion, this);
      });
    }

    if (this.relacionesInvertidas.length) {
      this.lineas = [
        ...this.lineas,
        ...this.relacionesInvertidas.map((relacion) => {
          return crearLineaDeRelacion(relacion, this);
        }),
      ];
    }
  }
}
