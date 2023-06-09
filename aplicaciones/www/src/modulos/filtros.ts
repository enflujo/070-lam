import grados from '../datos/grados.json';
import poderes from '../datos/poderes.json';
import { FuenteDatos } from '../programa';
import { crearParrafos, normalizarTexto } from '../utilidades/ayudas';
import { apagarRedPoder, filtrarNodo, mostrarNodosEnAnillo, mostrarRedPoder, prenderTodos } from './red';

const filtroPersonas = document.getElementById('filtroPersonas') as HTMLSelectElement;
const filtroOrgs = document.getElementById('filtroOrgs') as HTMLSelectElement;
const contenedorPoderes = document.getElementById('poderes');

let poderActivo: string | null = null;
let elementoPoderActivo: HTMLDivElement;

export function definirFiltros(datos: FuenteDatos) {
  definirFiltrosAgentes(datos);
  definirFiltrosPoderes();
  definirFiltrosCercania();
}

export function reiniciarAgentes() {
  filtroPersonas.value = 'todas';
  filtroOrgs.value = 'todas';
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
    prenderTodos();
    if (filtroOrgs.value !== 'todas') {
      filtroOrgs.value = 'todas';
    }
    filtrarNodo(filtroPersonas.value);
  };

  filtroOrgs.onchange = () => {
    prenderTodos();
    if (filtroPersonas.value !== 'todas') {
      filtroPersonas.value = 'todas';
    }
    filtrarNodo(filtroOrgs.value);
  };
}

function definirFiltrosCercania() {
  const cercanias = document.querySelector('#cercania .contenedor') as HTMLDivElement;
  const contenedores: HTMLElement[] = [];
  let mostrandoGrado = -1;

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
      }
    });

    // contenedor.onmouseenter = () => {
    //   mostrarNodosEnAnillo(grado.grado + 1);
    // };

    // contenedor.onmouseleave = () => {
    //   prenderTodos();
    // };

    contenedor.appendChild(titulo);
    contenedor.appendChild(contenido);
    cercanias.appendChild(contenedor);
    contenedores.push(contenedor);
  });
}

function definirFiltrosPoderes() {
  poderes.forEach((poder) => {
    const elemento = document.createElement('div');
    const llave = normalizarTexto(poder);
    elemento.className = 'poder';
    elemento.innerText = poder;
    contenedorPoderes?.appendChild(elemento);

    elemento.onclick = () => {
      if (poderActivo === llave) {
        apagarRedPoder();
        poderActivo = null;
        elemento.classList.remove('activo');
      } else {
        mostrarRedPoder(llave);
        poderActivo = llave;
        elementoPoderActivo?.classList.remove('activo');
        elemento.classList.add('activo');
        elementoPoderActivo = elemento;
      }
    };
  });
}

export function desactivarPoder() {
  if (elementoPoderActivo) elementoPoderActivo.classList.remove('activo');
  poderActivo = null;
}
