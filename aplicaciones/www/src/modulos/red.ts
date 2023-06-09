import Nodo from './Nodo';
import { DatosAgente, Dims, NodoRelacion, Relacion } from '../tipos';
import { aleatorioFraccion } from '../utilidades/ayudas';
import { agenteActivo, leyendo, mostrarAgente } from '../cerebros/general';
import { llenarInfo } from './columnaInfo';
import { FuenteDatos } from '../programa';

const nodos: Nodo[] = [];
const contenedorInfo = document.getElementById('info') as HTMLDivElement;
const conexiones = document.querySelector<SVGGElement>('#conexiones');
let nodoAnterior: Nodo;
let nodoLAM: Nodo;

/**
 * Crear nodos para la red a partir de agentes.
 *
 * @param agentes Los datos que vienen del Tally
 */
export function crearNodos(agentes: FuenteDatos) {
  const contenedorAgentes = document.getElementById('contenedorAgentes') as HTMLDivElement;

  const cantidades = agentes.reduce(
    (acumulado, obj) => {
      acumulado[obj.grado]++;
      return acumulado;
    },
    [0, 0, 0, 0, 0]
  );

  const posiciones = cantidades.map((total) => {
    return { paso: 1 / total, i: 0, total };
  });

  agentes.forEach((agente) => {
    let anillo = agente.grado;
    let esLam = false;

    if (agente.nombre.toLocaleLowerCase() !== 'lazos de amor mariano') {
      anillo++;
    } else {
      esLam = true;
    }

    const anguloMax = posiciones[agente.grado].i * posiciones[agente.grado].paso;
    const anguloMin = anguloMax - posiciones[agente.grado].paso * 0.5;
    const angulo = aleatorioFraccion(anguloMin, anguloMax);
    const nodo = new Nodo(agente as DatosAgente, anillo, angulo);

    if (esLam) {
      nodoLAM = nodo;
      llenarInfo(nodo);
    }

    contenedorAgentes.appendChild(nodo.elemento);
    posiciones[agente.grado].i++;
    nodos.push(nodo);
  });

  nodos.forEach((nodo) => {
    nodo.definirRelaciones();
  });
}

export function crearLineaDeRelacion(relacion: Relacion, nodo: Nodo) {
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
    nodo.nodosRelacionados.push(nodoRelacionado);
  } else {
    console.log('no se encontró nodo relacionado', nodo.nombre, relacion);
  }

  return respuesta;
}

agenteActivo.subscribe((nombre) => {
  if (nombre) {
    nodos.forEach((nodo) => {
      if (nodo.nombre === nombre) {
        nodo.activar();
        nodoAnterior = nodo;
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

    if (nodoAnterior) {
      esconderRed(nodoAnterior);
    }
  }
});

mostrarAgente.subscribe((nodo) => {
  if (nodo) {
    const { tipo } = nodo;
    contenedorInfo.classList.add(tipo);

    if (tipo === 'org') {
      contenedorInfo.classList.remove('lam');
      contenedorInfo.classList.remove('persona');
    } else {
      contenedorInfo.classList.remove('lam');
      contenedorInfo.classList.remove('org');
    }

    llenarInfo(nodo);
    mostrarRed(nodo);
    nodoAnterior = nodo;
  } else {
    contenedorInfo.classList.add('lam');
    contenedorInfo.classList.remove('persona');
    contenedorInfo.classList.remove('org');
    if (nodoAnterior) esconderRed(nodoAnterior);
    llenarInfo(nodoLAM);
  }
});

/**
 * Actualizar todos los nodos para pintar un fotograma de la animación.
 */
export function actualizarNodos() {
  nodos.forEach((nodo) => {
    nodo.actualizar();
    if (nodo.mostrarRelaciones) {
      mostrarRed(nodo);
    }
  });
}

/**
 * Escala los nodos de la red según las nuevas dimensiones.
 * @param dims Dimensiones de la pantalla
 */
export function escalarNodos(dims: Dims) {
  if (nodos && nodos.length) {
    nodos.forEach((nodo) => {
      nodo.escalar(dims);
    });
  }
}

/**
 * Lista con nodos de la red.
 * @returns Devuelve los nodos que se ha creado.
 */
export function losNodos() {
  return nodos;
}

export function mostrarRed(nodo: Nodo) {
  if (nodo.lineas.length) {
    nodo.lineas.forEach((obj) => {
      if (obj.hacia) {
        const destino = nodos[obj.hacia];
        const { linea } = obj;
        linea.setAttribute('x1', `${nodo.x}`);
        linea.setAttribute('y1', `${nodo.y}`);
        linea.setAttribute('x2', `${destino.x}`);
        linea.setAttribute('y2', `${destino.y}`);
      }
    });
  }
}

export function esconderRed(nodo: Nodo) {
  if (!nodo || !nodo.mostrarRelaciones) return;

  if (nodo.lineas.length) {
    nodo.lineas.forEach((obj) => {
      const { linea } = obj;
      linea.setAttribute('x1', `${nodo.x}`);
      linea.setAttribute('y1', `${nodo.y}`);
      linea.setAttribute('x2', `${nodo.x}`);
      linea.setAttribute('y2', `${nodo.y}`);
    });
  }
  nodo.elemento.classList.remove('ejePrincipal');
  nodo.mostrarRelaciones = false;
}

export function eventoNodosRelacionados(indices: number[], nodoActual: Nodo) {
  nodoAnterior = nodoActual;
  nodos.forEach((nodo, i) => {
    if (nodoActual !== nodo) {
      nodo.cambiarEstadoApagado(!indices.includes(i));
    } else {
      nodo.cambiarEstadoApagado(false);
    }
  });
}

export function prenderTodos() {
  document.querySelector('.ejePrincipal')?.classList.remove('ejePrincipal');
  nodos.forEach((nodo) => {
    nodo.cambiarEstadoApagado(false);
    esconderRed(nodo);
    nodo.elemento.classList.remove('invisible');
  });
}

export function filtrarNodo(llave: string) {
  if (nodoAnterior) esconderRed(nodoAnterior);
  const seleccion = nodos.find((nodo) => nodo.llave === llave);

  if (seleccion) {
    llenarInfo(seleccion);
    seleccion.elemento.classList.add('activo', 'ejePrincipal');
    seleccion.mostrarRelaciones = true;
    nodoAnterior = seleccion;
  }

  nodos.forEach((nodo, i) => {
    if (llave === 'todos') {
      nodo.elemento.classList.remove('invisible');
    } else {
      if (seleccion) {
        if (nodo !== seleccion && !seleccion.nodosRelacionados.includes(i)) {
          nodo.elemento.classList.add('invisible');
        } else {
          nodo.elemento.classList.remove('invisible');
        }
      }
    }
  });
}

export function mostrarNodosEnAnillo(anillo: number) {
  nodos.forEach((nodo) => {
    if (nodo.anillo !== anillo) {
      nodo.cambiarEstadoApagado(true);
    } else {
      nodo.cambiarEstadoApagado(false);
    }
  });
}

export function mostrarRedPoder(llave: string) {
  nodos.forEach((nodo) => {
    if (nodo.poder === llave) {
      nodo.elemento.classList.remove('apagado');
      nodo.activo = true;
    } else {
      nodo.elemento.classList.add('apagado');
      nodo.activo = false;
    }
  });
}

export function apagarRedPoder() {
  nodos.forEach((nodo) => {
    nodo.elemento.classList.remove('apagado');
    nodo.activo = true;
  });
}
