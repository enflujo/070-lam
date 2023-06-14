import { agenteActivo, poderesActivos } from '../cerebros/general';
import grados from '../datos/grados.json';
import poderes from '../datos/poderes.json';
import { FuenteDatos } from '../programa';
import { crearParrafos, normalizarTexto } from '../utilidades/ayudas';
import { mostrarNodosEnAnillo, prenderTodos } from './red';

const filtroPersonas = document.getElementById('filtroPersonas') as HTMLSelectElement;
const filtroOrgs = document.getElementById('filtroOrgs') as HTMLSelectElement;
const contenedorPoderes = document.querySelector('#poderes .colapsable') as HTMLDivElement;

const elementosPoderes: { [llave: string]: HTMLDivElement } = {};
let elementoPoderActivo: HTMLDivElement;
let mostrandoGrado = -1;
let elementoCercaniaActiva: HTMLElement;

export function definirFiltros(datos: FuenteDatos) {
  definirFiltrosAgentes(datos);
  definirFiltrosPoderes();
  definirFiltrosCercania();
}

export function reiniciarFiltros() {
  reiniciarAgentes();
  reiniciarPoderes();
  reiniciarCercanias();
}

export function reiniciarAgentes() {
  filtroPersonas.value = 'todas';
  filtroOrgs.value = 'todas';
}

function reiniciarPoderes() {
  if (elementoPoderActivo) elementoPoderActivo.classList.remove('activo');
}

function reiniciarCercanias() {
  if (elementoCercaniaActiva) elementoCercaniaActiva.classList.add('cerrado');
  mostrandoGrado = -1;
}

function definirFiltrosAgentes(datos: FuenteDatos) {
  const personas = datos.filter((fila) => fila.tipo === 'persona');
  const orgs = datos.filter((fila) => fila.tipo === 'org');

  personas.forEach((persona) => {
    filtroPersonas.appendChild(new Option(persona.nombre, normalizarTexto(persona.nombre)));
  });

  orgs.forEach((org) => {
    filtroOrgs?.appendChild(new Option(org.nombre, normalizarTexto(org.nombre)));
  });

  filtroPersonas.onchange = () => {
    agenteActivo.set(filtroPersonas.value);
    // prenderTodos();
    // if (filtroOrgs.value !== 'todas') {
    //   filtroOrgs.value = 'todas';
    // }

    // filtrarNodo(filtroPersonas.value);
  };

  filtroOrgs.onchange = () => {
    agenteActivo.set(filtroOrgs.value);
    // prenderTodos();
    // if (filtroPersonas.value !== 'todas') {
    //   filtroPersonas.value = 'todas';
    // }
    // filtrarNodo(filtroOrgs.value);
  };
}

function definirFiltrosCercania() {
  const cercanias = document.querySelector('#cercania .contenedor') as HTMLDivElement;
  const contenedores: HTMLElement[] = [];

  grados.forEach((grado) => {
    const contenedor = document.createElement('section');
    const titulo = document.createElement('h4');
    const botonColapsable = document.createElement('span');
    const contenido = document.createElement('div');

    contenedor.className = `infoSeccion subSeccion mostrar cerrado grado${grado.grado}`;
    titulo.className = 'tituloColapsable interTitulo';
    botonColapsable.className = 'colapsableBtn';
    contenido.className = 'colapsable';

    titulo.innerText = grado.nombre;
    titulo.appendChild(botonColapsable);

    const parrafos = crearParrafos(grado.descripcion);

    if (parrafos) {
      contenido.replaceChildren(...parrafos);
    }

    titulo.addEventListener('click', () => {
      if (mostrandoGrado === grado.grado) {
        prenderTodos();
        mostrandoGrado = -1;
      } else {
        contenedores.forEach((elemento) => {
          if (elemento !== contenedor) {
            elemento.classList.add('cerrado');
          }
        });
        mostrarNodosEnAnillo(grado.grado + 1);
        mostrandoGrado = grado.grado;
        elementoCercaniaActiva = contenedor;
      }
    });

    contenedor.appendChild(titulo);
    contenedor.appendChild(contenido);
    cercanias.appendChild(contenedor);
    // contenedores.push(contenedor);
  });
}

function definirFiltrosPoderes() {
  poderes.forEach((poder) => {
    const elemento = document.createElement('div');
    const icono = document.createElement('span');
    const nombre = document.createElement('span');
    const llave = normalizarTexto(poder);

    elemento.className = `poder ${llave}`;
    nombre.className = 'nombrePoder';
    nombre.innerText = poder;
    icono.className = 'iconoPoder';

    elemento.appendChild(icono);
    elemento.appendChild(nombre);
    contenedorPoderes?.appendChild(elemento);

    elemento.onclick = () => {
      activarPoder(llave);

      // if (poderActivo === llave) {
      //   desactivarZona(llave);
      //   apagarRedPoder();
      //   poderActivo = null;
      //   elemento.classList.remove('activo');
      // } else {

      //   // activarZona(llave);
      //   // mostrarRedPoder(llave);
      //   // poderActivo = llave;
      //   // elementoPoderActivo?.classList.remove('activo');
      //   // elemento.classList.add('activo');
      //   // elementoPoderActivo = elemento;
      // }
    };

    elementosPoderes[llave] = elemento;
  });
}

export function activarPoder(llave: string) {
  const poderes = poderesActivos.get();
  const indice = poderes.indexOf(llave);

  if (indice < 0) {
    poderes.push(llave);
  } else {
    poderes.splice(indice, 1);
  }

  poderesActivos.set([...poderes]);
}

poderesActivos.subscribe((listaPoderes) => {
  for (const poder in elementosPoderes) {
    if (listaPoderes.includes(poder)) {
      elementosPoderes[poder].classList.add('activo');
    } else {
      elementosPoderes[poder].classList.remove('activo');
    }
  }
});
