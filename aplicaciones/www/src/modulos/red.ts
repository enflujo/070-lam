import Nodo from '../componentes/Nodo';
import { DatosAgente, Dims, Relacion } from '../tipos';
import { aleatorioFraccion, crearParrafos } from '../utilidades/ayudas';
import { agenteActivo, estanOrbitando, leyendo, mostrarAgente } from '../cerebros/general';
import { llenarInfo } from './columnaInfo';
import { FuenteDatos } from '../programa';

const nodos: Nodo[] = [];
const contenedorInfo = document.getElementById('info') as HTMLDivElement;
let nodoAnterior: Nodo;
let nodoLAM: Nodo;

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

agenteActivo.subscribe((nombre) => {
  if (nombre) {
    nodos.forEach((nodo) => {
      if (nodo.datos.nombre === nombre) {
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
    const { tipo } = nodo.datos;
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

export function actualizarNodos() {
  nodos.forEach((nodo) => {
    nodo.actualizar();
    if (nodo.mostrarRelaciones) {
      mostrarRed(nodo);
    } else {
      esconderRed(nodo);
    }
  });
}

export function escalarNodos(dims: Dims) {
  if (nodos && nodos.length) {
    nodos.forEach((nodo) => {
      nodo.escalar(dims);
    });
  }
}

function elementoListaRelacion(relacion: Relacion) {
  const elemento = document.createElement('li');
  const descriptor = document.createElement('span');
  const relacionCon = document.createElement('span');

  elemento.className = 'relacion';
  descriptor.className = 'descriptor';
  relacionCon.className = 'relacionCon';

  descriptor.innerText = relacion.descriptor;
  if (relacion.con) relacionCon.innerText = relacion.con;

  if (relacion.activo) {
    elemento.classList.add('activo');
  }

  if (relacion.tipo) elemento.classList.add(relacion.tipo);

  elemento.appendChild(descriptor);
  elemento.appendChild(relacionCon);
  return elemento;
}

export function crearInfo(datos: DatosAgente) {
  const { nombre, descripcion, img, relaciones, relacionesInvertidas } = datos;
  const respuesta: { foto?: HTMLImageElement; perfil?: HTMLParagraphElement[]; relaciones?: HTMLLIElement[] } = {};
  if (img) {
    const foto = new Image();
    foto.src = `${import.meta.env.BASE_URL}/imgs/${img}`;
    foto.setAttribute('alt', `Foto de ${nombre}`);
    respuesta.foto = foto;
  }

  if (descripcion) {
    respuesta.perfil = crearParrafos(descripcion);
  }

  if (relaciones.length) {
    respuesta.relaciones = relaciones.map((relacion) => {
      return elementoListaRelacion(relacion);
    });
  }

  if (relacionesInvertidas.length) {
    const relacionesActuales = respuesta.relaciones ? respuesta.relaciones : [];

    respuesta.relaciones = [
      ...relacionesActuales,
      ...relacionesInvertidas.map((relacion) => {
        return elementoListaRelacion(relacion);
      }),
    ];
  }

  return respuesta;
}

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
  });

  esconderRed(nodoAnterior);
}

export function filtrarNodo(llave: string) {
  if (nodoAnterior) esconderRed(nodoAnterior);
  const seleccion = nodos.find((nodo) => nodo.llave === llave);

  if (seleccion) {
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