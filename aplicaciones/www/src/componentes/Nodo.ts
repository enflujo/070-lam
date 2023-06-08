import { agenteActivo, estanOrbitando, leyendo, mostrarAgente } from '../cerebros/general';
import type { DatosAgente, Dims, NodoRelacion, Punto, Relacion, TipoAgente } from '../tipos';
import { crearInfo, eventoNodosRelacionados, losNodos, prenderTodos } from '../modulos/red';
import { normalizarTexto } from '../utilidades/ayudas';

const DOS_PI = Math.PI * 2;
const conexiones = document?.querySelector<SVGGElement>('#conexiones');

export default class Nodo {
  nombre: string;
  tipo: TipoAgente;
  llave: string;
  poder: string;
  elemento: HTMLDivElement;
  anillo: number;
  datos: DatosAgente;
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
  relaciones?: HTMLLIElement[];
  nodosRelacionados: number[];

  constructor(datos: DatosAgente, anillo: number, angulo: number) {
    this.nombre = datos.nombre;
    this.llave = normalizarTexto(datos.nombre);
    this.tipo = datos.tipo;
    this.poder = normalizarTexto(datos.circulo_1);
    this.elemento = document.createElement('div');
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
    this.nodosRelacionados = [];
    texto.className = 'nombre';
    texto.innerText = datos.nombre;
    icono.className = 'icono';
    this.elemento.className = 'nodo activo';
    this.elemento.appendChild(icono);
    this.elemento.appendChild(texto);

    this.elemento.onmouseenter = () => {
      if (!this.activo) return;

      estanOrbitando.set(false);
      mostrarAgente.set(this);

      eventoNodosRelacionados(this.nodosRelacionados, this);

      this.mostrarRelaciones = true;
    };

    this.elemento.onmouseleave = () => {
      estanOrbitando.set(true);

      if (!this.activo || leyendo.get()) return;
      prenderTodos();
      mostrarAgente.set(null);
    };

    this.elemento.onclick = (evento) => {
      evento.stopPropagation();

      if (leyendo.get()) {
        agenteActivo.set(null);
        this.elemento.classList.remove('ejePrincipal');
      } else {
        this.elemento.classList.add('ejePrincipal');
        this.mostrarRelaciones = true;
        agenteActivo.set(this.datos.nombre);
      }
    };

    const elementos = crearInfo(datos);

    if (elementos.foto) this.foto = elementos.foto;
    if (elementos.perfil) this.perfil = elementos.perfil;
    if (elementos.relaciones) this.relaciones = elementos.relaciones;
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
    const nodos = losNodos();

    const crearLinea = (relacion: Relacion) => {
      const linea = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      linea.setAttribute('class', `conexion ${relacion.tipoRelacion}`);

      if (!relacion.activo) {
        linea.setAttribute('stroke-dasharray', '4');
      }

      if (relacion.tipo) {
        linea.classList.add(relacion.tipo);
      }

      conexiones?.appendChild(linea);

      const respuesta: NodoRelacion = { linea };
      const nodoRelacionado = nodos.findIndex((nodo) => nodo.nombre === relacion.con);

      if (nodoRelacionado >= 0) {
        respuesta.hacia = nodoRelacionado;
        this.nodosRelacionados.push(nodoRelacionado);
      } else {
        // Cuando no hay agente 2 que hacer?
        console.log('no se encontró nodo relacionado', this.nombre, relacion);
      }

      return respuesta;
    };

    if (this.datos.relaciones.length) {
      this.lineas = this.datos.relaciones.map((relacion) => {
        return crearLinea(relacion);
      });
    }

    if (this.datos.relacionesInvertidas.length) {
      this.lineas = [
        ...this.lineas,
        ...this.datos.relacionesInvertidas.map((relacion) => {
          return crearLinea(relacion);
        }),
      ];
    }
  }
}
